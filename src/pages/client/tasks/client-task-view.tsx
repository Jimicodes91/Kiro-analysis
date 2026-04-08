import FormRenderer from "@/components/forms/form-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DragNdrop from "@/components/ui/file-upload";
import { TaskStatusBadge } from "@/components/ui/task-status-badge";
import useUpdateClientResponse from "@/hooks/project-modules/tasks/use-update-client-response";
import { fileToBase64 } from "@/lib/utils";
import { TaskDetails } from "@/types/api.types";
import { ClientResponse, FormConfig } from "@/types/task.types";
import { format } from "date-fns";
import { CheckCircle2, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

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
};

const ClientTaskView = ({ task }: ClientTaskViewProps) => {
  const navigate = useNavigate();
  const updateResponse = useUpdateClientResponse(task.id);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCompleted = task.status === "completed";
  const categoryLabel = task.task_category_type
    ? CATEGORY_TYPE_LABELS[task.task_category_type] ?? task.task_category_type
    : "Task";

  const handleSubmit = async () => {
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
            {task.task_category_type === "document_upload" && (
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

            {task.task_category_type === "signing" && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Please review and sign the document</span>
              </div>
            )}

            {task.task_category_type === "information_request" && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Please provide the requested information</span>
              </div>
            )}

            {/* Generic fallback for tasks without a specific category type */}
            {!task.task_category_type && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Complete this task</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting || updateResponse.isPending}
              >
                Mark as Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientTaskView;
