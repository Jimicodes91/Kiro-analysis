import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteTask = (projectId: string | null, taskId: string) => {
  const queryClient = useQueryClient();

  const endpoint = projectId
    ? ENDPOINTS.DELETE_TASK(projectId, taskId)
    : ENDPOINTS.DELETE_STANDALONE_TASK(taskId);

  return useCustomMutation({
    method: "delete",
    endpoint,
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
