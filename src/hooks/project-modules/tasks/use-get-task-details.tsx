import useCustomQuery from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { TaskDetails } from "@/types/api.types";

export interface TaskDetailsResponse {
  success: boolean;
  message: string;
  data: TaskDetails;
}

const useGetTaskDetails = (projectId: string, taskId: string) => {
  return useCustomQuery<TaskDetailsResponse>({
    endpoint: ENDPOINTS.GET_TASK_DETAILS(projectId, taskId),
    queryKey: [QUERYKEYS.GET_TASK_DETAILS, projectId, taskId],
    enabled: !!projectId && !!taskId,
  });
};

export default useGetTaskDetails;
