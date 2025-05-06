import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteEvent = (projectId: string, eventId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_EVENT(projectId, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_EVENTS],
      });
    },
  });
};

export default useDeleteEvent;
