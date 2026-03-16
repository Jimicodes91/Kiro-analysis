import useCustomQuery from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetTaskDetails = (projectId: string, taskId: string) => {
  return useCustomQuery({
    endpoint: ENDPOINTS.GET_TASK_DETAILS(projectId, taskId),
    queryKey: [QUERYKEYS.GET_TASK_DETAILS, projectId, taskId],
    enabled: !!projectId && !!taskId,
  });
};

export default useGetTaskDetails;
