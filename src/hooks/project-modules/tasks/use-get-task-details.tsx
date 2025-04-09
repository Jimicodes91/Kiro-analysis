import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { TaskDetails } from "@/types/api.types";

export interface TaskDetailsResponse {
  success: boolean;
  message: string;
  data: TaskDetails;
}

const useGetAllProjectTaskDetails = (projectId: string, taskId: string) => {
  return useQueryActionHook<TaskDetailsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_TASK_DETAILS(projectId, taskId),
    queryKey: [QUERYKEYS.GET_TASK_DETAILS, projectId, taskId],
  });
};

export default useGetAllProjectTaskDetails;
