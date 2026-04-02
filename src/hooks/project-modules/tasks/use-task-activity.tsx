import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { TaskActivityLogEntry } from "@/types/task.types";

interface TaskActivityResponse {
  success: boolean;
  message: string;
  data: TaskActivityLogEntry[];
}

export const useTaskActivity = (projectId: string, taskId: string) => {
  const endpoint = projectId
    ? ENDPOINTS.GET_TASK_ACTIVITY(projectId, taskId)
    : ENDPOINTS.GET_STANDALONE_TASK_ACTIVITY(taskId);

  return useQueryActionHook<TaskActivityResponse>({
    method: "get",
    endpoint,
    queryKey: [QUERYKEYS.GET_TASK_ACTIVITY, projectId, taskId],
    enabled: !!taskId,
  });
};
