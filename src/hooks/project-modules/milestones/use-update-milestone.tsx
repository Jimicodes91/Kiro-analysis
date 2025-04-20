import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateMilestone = (milestoneId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      name?: string;
      duration?: string;
      is_completed?: boolean;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_MILESTONE_DETAILS(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPES],
      });
    },
  });
};

export default useUpdateMilestone;
