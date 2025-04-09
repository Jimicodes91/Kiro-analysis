import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useUpdateEvent = (projectId: string, eventId: string) => {
  return useCustomMutation<Record<string, string>>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_PROJECT_EVENT(projectId, eventId),
  });
};

export default useUpdateEvent;
