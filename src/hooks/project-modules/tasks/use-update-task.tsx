import useCustomMutation from "@/hooks/use-mutationaction";
import { QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateTaskPayload {
  name?: string;
  due_date?: string;
  status?: string;
  task_category_type?: string;
  contact_id?: string | null;
  priority?: string;
  description?: string;
}

const useUpdateTask = (projectId: string | null, taskId: string) => {
  const queryClient = useQueryClient();
  const endpoint = projectId
    ? `projects/${projectId}/tasks/${taskId}`
    : `tasks/${taskId}`;
  return useCustomMutation<Record<string, string>, UpdateTaskPayload>({
    method: "patch",
    endpoint,
    showSuccessToast: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_ALL_TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_ALL_PROJECT_TASKS] });
    },
  });
};

export default useUpdateTask;
