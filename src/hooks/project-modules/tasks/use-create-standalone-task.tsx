import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useCreateStandaloneTask = () => {
  const queryClient = useQueryClient();
  return useCustomMutation<Record<string, string>, Record<string, any>>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_STANDALONE_TASK,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_TASKS],
      });
    },
  });
};

export default useCreateStandaloneTask;
