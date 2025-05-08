import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateTaskRequest {
  name?: string;
  description?: string;
  // status: "in_progress" | "completed" | "pending";
  status: string;
  start_date?: string;
  end_date?: string;
  attachments?: string[];
  is_visible_to_client?: boolean;
  task_type_id?: string;
  project_type_id?: string;
  assignees?: string[];
}

const useUpdateTask = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<Record<string, string>, UpdateTaskRequest>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_TASK_DETAILS(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_TASKS],
      });
    },
  });
};

export default useUpdateTask;
