import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { TaskActivityLogEntry } from "@/types/task.types";

interface TaskActivityResponse {
  success: boolean;
  message: string;
  data: TaskActivityLogEntry[];
}

export const useTaskActivity = (projectId: string, taskId: string) => {
  return useQueryActionHook<TaskActivityResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_TASK_ACTIVITY(projectId, taskId),
    queryKey: [QUERYKEYS.GET_TASK_ACTIVITY, projectId, taskId],
    enabled: !!projectId && !!taskId,
  });
};
