import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetAllProjectEvents = (projectId: string) => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_EVENTS(projectId),
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_EVENTS, projectId],
  });
};

export default useGetAllProjectEvents;
