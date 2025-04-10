import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { TaskTypeDetails } from "@/types/api.types";

export interface TaskTypeListResponse {
  success: boolean;
  message: string;
  data: TaskTypeDetails[];
}

const useGetAllProjectTaskTypes = (projectId: string) => {
  return useQueryActionHook<TaskTypeListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_TASK_TYPES(projectId),
    queryKey: [QUERYKEYS.GET_TASK_TYPES, projectId],
  });
};

export default useGetAllProjectTaskTypes;
