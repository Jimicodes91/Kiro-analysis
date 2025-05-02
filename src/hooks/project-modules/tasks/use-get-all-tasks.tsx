import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Task } from "@/types/task.types";

export interface TaskListResponse {
  success: boolean;
  message: string;
  data: Task[];
}

const useGetAllTasks = (projectId?: string) => {
  const projectIdKey = projectId ?? "";
  return useQueryActionHook<TaskListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_TASKS(projectId),
    queryKey: [QUERYKEYS.GET_ALL_TASKS, projectIdKey],
  });
};

export default useGetAllTasks;
