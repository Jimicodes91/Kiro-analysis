import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { EventDetails } from "@/types/api.types";

export interface EventList {
  success: boolean;
  message: string;
  data: EventDetails[];
}

const useGetAllProjectEvents = (projectId: string) => {
  return useQueryActionHook<EventList>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_EVENTS(projectId),
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_EVENTS, projectId],
  });
};

export default useGetAllProjectEvents;
