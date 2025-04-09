import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface UpdateTaskRequest {
  name?: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

const useUpdateTask = (projectId: string, taskId: string) => {
  return useCustomMutation<Record<string, string>, UpdateTaskRequest>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_TASK_DETAILS(projectId, taskId),
  });
};

export default useUpdateTask;
