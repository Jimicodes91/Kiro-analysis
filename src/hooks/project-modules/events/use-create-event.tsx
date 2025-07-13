import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface EventRequest {
  event_type_id?: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  venue: string;
  description: string;
  is_visible_to_client: boolean;
  invites: string[];
}

const useCreateEvent = (projectId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, EventRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_EVENT(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_EVENTS],
      });
    },
  });
};

export default useCreateEvent;
