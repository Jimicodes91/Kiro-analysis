import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateEventType = (eventTypeId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      name?: string;
      description?: string;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_EVENT_TYPE(eventTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_EVENT_TYPES],
      });
    },
  });
};

export default useUpdateEventType;
