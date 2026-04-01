import FormRenderer from "@/components/forms/form-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import DragNdrop from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import useUpdateClientResponse from "@/hooks/project-modules/tasks/use-update-client-response";
import { fileToBase64 } from "@/lib/utils";
import { TaskDetails } from "@/types/api.types";
import { ClientResponse, FormConfig } from "@/types/task.types";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface ResponseItem {
  required_item: string;
  is_completed: boolean;
  file_url: string | null;
  comment: string;
  file?: File | null;
}

interface ClientTaskViewProps {
  task: TaskDetails & {
    required_information?: string[];
    client_responses?: ClientResponse[];
    form_config?: FormConfig;
    client_id?: string;
  };
}

const ClientTaskView = ({ task }: ClientTaskViewProps) => {
  const navigate = useNavigate();
  const updateResponse = useUpdateClientResponse(task.id);

  const [responses, setResponses] = useState<ResponseItem[]>([]);

  useEffect(() => {
    const items = task.required_information ?? [];
    const existingResponses = task.client_responses ?? [];

    setResponses(
      items.map((item) => {
        const existing = existingResponses.find((r) => r.required_item === item);
        return {
          required_item: item,
          is_completed: existing?.is_completed ?? false,
          file_url: existing?.file_url ?? null,
          comment: existing?.comment ?? "",
          file: null,
        };
      })
    );
  }, [task]);

  const completedCount = responses.filter((r) => r.is_completed).length;
  const totalCount = responses.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const updateItem = useCallback((index: number, updates: Partial<ResponseItem>) => {
    setResponses((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  }, []);

  const handleSave = async () => {
    const payload = await Promise.all(
      responses.map(async (item) => {
        let fileUrl = item.file_url;
        if (item.file) {
          try {
            fileUrl = await fileToBase64(item.file);
          } catch {
            fileUrl = null;
          }
        }
        return {
          required_item: item.required_item,
          is_completed: item.is_completed,
          file_url: fileUrl ?? undefined,
          comment: item.comment || undefined,
        };
      })
    );

    try {
      await updateResponse.mutateAsync({ responses: payload } as any);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-4 bg-gray-50 page-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <IoArrowBack className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{task.name}</h1>
          <p className="text-sm text-[#19181980]">{task.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="px-2 py-1 rounded bg-white border text-xs font-medium">
          Due: {task.end_date ? format(new Date(task.end_date), "MMM d, yyyy") : "—"}
        </span>
        <span className="px-2 py-1 rounded bg-white border text-xs font-medium">
          Progress: {completedCount}/{totalCount} ({progressPercent}%)
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-black h-2 rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

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

      <div className="space-y-4">
        {responses.map((item, idx) => (
          <Card key={idx} className="border border-gray-200 shadow-none">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.is_completed}
                  onCheckedChange={(checked) =>
                    updateItem(idx, { is_completed: !!checked })
                  }
                />
                <div className="flex-1">
                  <p className={`font-medium ${item.is_completed ? "line-through text-gray-400" : ""}`}>
                    {item.required_item}
                  </p>
                </div>
              </div>

              <div className="ml-7 space-y-2">
                <Input
                  placeholder="Add a comment (optional)"
                  value={item.comment}
                  onChange={(e) => updateItem(idx, { comment: e.target.value })}
                />
                {item.file_url && !item.file && (
                  <p className="text-xs text-green-600">File uploaded</p>
                )}
                <DragNdrop
                  id={`client-upload-${idx}`}
                  value={item.file ? [item.file] : []}
                  onChange={(files: File[]) =>
                    updateItem(idx, { file: files?.[0] ?? null })
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalCount > 0 && (
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handleSave}
            isLoading={updateResponse.isPending}
          >
            Save Progress
          </Button>
          <Button
            onClick={handleSave}
            isLoading={updateResponse.isPending}
            disabled={completedCount < totalCount}
          >
            Mark as Complete
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientTaskView;
