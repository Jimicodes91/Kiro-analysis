import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Task } from "@/types/task.types";

export interface TaskListResponse {
  success: boolean;
  message: string;
  data: Task[];
}

const useGetAllTasks = (search?: string, context?: string, includeArchived?: boolean) => {
  const searchKey = search ?? "";
  const contextKey = context ?? "";
  const archivedKey = includeArchived ? "true" : "false";
  return useQueryActionHook<TaskListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_TASKS(search, context, includeArchived),
    queryKey: [QUERYKEYS.GET_ALL_TASKS, searchKey, contextKey, archivedKey],
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export default useGetAllTasks;
