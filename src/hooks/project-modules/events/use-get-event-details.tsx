import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { EventDetails } from "@/types/api.types";

export interface EventDetailsResponse {
  success: boolean;
  message: string;
  data: EventDetails;
}

const useGetEventDetails = (projectId: string, eventId: string) => {
  return useQueryActionHook<EventDetailsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_EVENT_DETAILS(projectId, eventId),
    queryKey: [QUERYKEYS.GET_EVENT_DETAILS, projectId, eventId],
  });
};

export default useGetEventDetails;
