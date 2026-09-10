import Toast from "@/components/Toast";
import FormRenderer from "@/components/forms/form-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DragNdrop from "@/components/ui/file-upload";
import { TaskStatusBadge } from "@/components/ui/task-status-badge";
import useUploadDocument from "@/hooks/project-modules/documents/use-upload-document";
import useUpdateClientResponse from "@/hooks/project-modules/tasks/use-update-client-response";
import { QUERYKEYS } from "@/lib/constants";
import { fileToBase64 } from "@/lib/utils";
import { TaskDetails } from "@/types/api.types";
import { ClientResponse, FormConfig } from "@/types/task.types";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCircle2, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { resolveActionUiKind } from "./action-ui";

interface ClientTaskViewProps {
  task: TaskDetails & {
    required_information?: string[];
    client_responses?: ClientResponse[];
    form_config?: FormConfig;
    client_id?: string;
    task_category_type?: string;
  };
}

const CATEGORY_TYPE_LABELS: Record<string, string> = {
  signing: "Signing",
  information_request: "Information Request",
  document_upload: "Document Upload",
  task: "General Task",
  complete_form: "Complete Form",
};

const ClientTaskView = ({ task }: ClientTaskViewProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateResponse = useUpdateClientResponse(task.id);
  const uploadDocument = useUploadDocument(task.project_id);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCompleted = task.status === "completed";
  // Centralized action-UI decision (see action-ui.ts). `actionUiKind` drives
  // which affordance renders below; behavior matches the previous inline logic.
  const actionUiKind = resolveActionUiKind(task.task_category_type, task.status);
  const categoryLabel = task.task_category_type
    ? CATEGORY_TYPE_LABELS[task.task_category_type] ?? task.task_category_type
    : "Task";

  const handleDocumentUpload = async () => {
    // Req 5.4 — require at least one file before submitting
    if (uploadedFiles.length === 0) {
      Toast.error("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);
    try {
      const file = uploadedFiles[0];

      let base64: string;
      try {
        base64 = await fileToBase64(file);
      } catch (err) {
        console.error("Error converting file:", err);
        Toast.error("Invalid file format");
        return;
      }

      // Backend expects pure base64 — strip the data URL prefix if present
      const attachment = base64.includes(",") ? base64.split(",")[1] : base64;

      // Req 5.1, 5.2, 5.3 — create a real document linked to the task via task_id
      await uploadDocument.mutateAsync({
        file_name: file.name || task.name,
        attachment,
        is_visible_to_client: true,
        task_id: task.id,
        project_id: task.project_id,
      });

      // Backend auto-completes the task (task 5.4); refresh so the completed
      // state renders and the upload UI is hidden (Req 6.4)
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_TASK_DETAILS] });
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_ALL_TASKS] });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    // Req 5.1–5.3, 6.4 — document-upload tasks create a real document via the
    // upload path instead of only sending a client-response file_url
    if (task.task_category_type === "document_upload") {
      await handleDocumentUpload();
      return;
    }

    setIsSubmitting(true);
    try {
      const responses = await Promise.all(
        (task.required_information ?? ["Complete task"]).map(async (item) => {
          let fileUrl: string | undefined;
          if (uploadedFiles.length > 0) {
            try {
              fileUrl = await fileToBase64(uploadedFiles[0]);
            } catch {
              fileUrl = undefined;
            }
          }
          return {
            required_item: item,
            is_completed: true,
            file_url: fileUrl,
          };
        })
      );
      await updateResponse.mutateAsync({ responses } as any);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 page-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <IoArrowBack className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{task.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categoryLabel}</p>
        </div>
      </div>

      {/* Task info bar */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-3 py-1.5 rounded-full bg-white border text-xs font-medium">
          Due: {task.end_date ? format(new Date(task.end_date), "MMM d, yyyy") : "—"}
        </span>
        <TaskStatusBadge status={task.status} />
      </div>

      {/* Admin instructions (read-only) — label adapts to category type */}
      {task.description && (
        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {task.task_category_type === "signing" && "Signing Instructions"}
              {task.task_category_type === "information_request" && "Information Request Details"}
              {task.task_category_type === "document_upload" && "Document Upload Instructions"}
              {task.task_category_type === "complete_form" && "Form Instructions"}
              {task.task_category_type === "task" && "Instructions"}
              {!task.task_category_type && "Instructions"}
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Completed state */}
      {isCompleted && (
        <Card className="border border-green-200 bg-green-50 shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-700">This task has been completed.</p>
          </CardContent>
        </Card>
      )}

      {/* Native form rendering */}
      {task.form_config?.mode === "native" && task.form_config?.form_id && (
        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-0">
            <FormRenderer
              templateId={task.form_config.form_id}
              taskId={task.id}
              clientId={task.client_id ?? ""}
              projectId={task.project_id}
            />
          </CardContent>
        </Card>
      )}

      {/* Action area based on category type */}
      {!isCompleted && (
        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-4 space-y-4">
            {actionUiKind === "document_upload" && (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Upload className="w-4 h-4" />
                  <span>Upload your document</span>
                </div>
                <DragNdrop
                  id="client-doc-upload"
                  value={uploadedFiles}
                  onChange={(files: File[]) => setUploadedFiles(files)}
                />
              </>
            )}

            {actionUiKind === "signing" && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Please review and sign the document</span>
              </div>
            )}

            {actionUiKind === "information_request" && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Please provide the requested information</span>
              </div>
            )}

            {/* Complete Form — placeholder UI, no external form connection */}
            {actionUiKind === "complete_form" &&
              (task.form_config?.mode === "native" && task.form_config?.form_id ? null : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    <span>Complete the form</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    This form will be available here.
                  </p>
                </div>
              ))}

            {/* General Task and any unrecognized type → general completion UI */}
            {actionUiKind === "general" && (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {task.description
                      ? "Review the instructions above and mark this task complete"
                      : "Mark this task as complete"}
                  </span>
                </div>
              )}

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSubmit}
                isLoading={
                  isSubmitting ||
                  updateResponse.isPending ||
                  uploadDocument.isPending
                }
              >
                {task.task_category_type === "document_upload"
                  ? "Upload & Complete"
                  : "Mark as Complete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientTaskView;
