import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface EventRequest {
  event_type_id: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  venue: string;
  description: string;
  is_visible_to_client: boolean;
  invites: string[];
}

const useCreateEvent = (projectId: string) => {
  return useCustomMutation<Record<string, string>, EventRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_EVENT(projectId),
  });
};

export default useCreateEvent;
