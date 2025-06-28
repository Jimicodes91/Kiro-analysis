import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteTask = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_TASK(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TASKS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_TASKS],
      });
    },
  });
};

export default useDeleteTask;
