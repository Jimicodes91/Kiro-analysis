import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface ClientResponsePayload {
  responses: Array<{
    required_item: string;
    file_url?: string;
    is_completed?: boolean;
    comment?: string;
  }>;
}

const useUpdateClientResponse = (taskId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<Record<string, unknown>, ClientResponsePayload>({
    method: "post",
    endpoint: ENDPOINTS.UPDATE_CLIENT_TASK_RESPONSE(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_TASK_DETAILS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_TASKS],
      });
    },
  });
};

export default useUpdateClientResponse;
