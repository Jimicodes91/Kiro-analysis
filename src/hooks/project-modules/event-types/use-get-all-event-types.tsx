import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { EventTypeDetails } from "@/types/api.types";

export interface EventTypeListResponse {
  success: boolean;
  message: string;
  data: EventTypeDetails[];
}

const useGetAllProjectEventTypes = (projectId: string) => {
  return useQueryActionHook<EventTypeListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_EVENT_TYPES(projectId),
    queryKey: [QUERYKEYS.GET_EVENT_TYPES, projectId],
  });
};

export default useGetAllProjectEventTypes;
