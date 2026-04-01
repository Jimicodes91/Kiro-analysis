import useCustomMutation from "@/hooks/use-mutationaction";
import { QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateTaskStatus = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<Record<string, string>, { status: string }>({
    method: "patch",
    endpoint: `projects/${projectId}/tasks/${taskId}/status`,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_ALL_PROJECT_TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_ALL_TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_TASK_DETAILS] });
    },
  });
};

export default useUpdateTaskStatus;
