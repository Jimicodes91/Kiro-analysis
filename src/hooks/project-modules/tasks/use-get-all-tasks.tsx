import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Task } from "@/types/task.types";

export interface TaskListResponse {
  success: boolean;
  message: string;
  data: Task[];
}

const useGetAllTasks = (search?: string) => {
  const searchKey = search ?? "";
  return useQueryActionHook<TaskListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_TASKS(search),
    queryKey: [QUERYKEYS.GET_ALL_TASKS, searchKey],
  });
};

export default useGetAllTasks;
