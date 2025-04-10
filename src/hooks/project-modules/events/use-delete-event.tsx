import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useDeleteEvent = (projectId: string, eventId: string) => {
  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_EVENT(projectId, eventId),
  });
};

export default useDeleteEvent;
