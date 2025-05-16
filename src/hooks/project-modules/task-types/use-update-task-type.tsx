import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateTaskType = (taskTypeId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      name?: string;
      description?: string;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_TASK_TYPE(taskTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_TASK_TYPES],
      });
    },
  });
};

export default useUpdateTaskType;
