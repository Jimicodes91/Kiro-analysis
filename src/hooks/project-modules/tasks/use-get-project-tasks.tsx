import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { TaskDetails } from "@/types/api.types";

export interface TaskListResponse {
  success: boolean;
  message: string;
  data: TaskDetails[];
}

const useGetProjectTasks = (projectId: string, assigneeId?: string) => {
  return useQueryActionHook<TaskListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_TASKS(projectId, assigneeId),
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_TASKS, projectId, `${assigneeId}`],
  });
};

export default useGetProjectTasks;
