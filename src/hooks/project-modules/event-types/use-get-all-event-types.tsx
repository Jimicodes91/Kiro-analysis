import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { EventTypeDetails } from "@/types/api.types";

export interface EventTypeListResponse {
  success: boolean;
  message: string;
  data: EventTypeDetails[];
}

const useGetAllEventTypes = () => {
  return useQueryActionHook<EventTypeListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_EVENT_TYPES,
    queryKey: [QUERYKEYS.GET_EVENT_TYPES],
  });
};

export default useGetAllEventTypes;
