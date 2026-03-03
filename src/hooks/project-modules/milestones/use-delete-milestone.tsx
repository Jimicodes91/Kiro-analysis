import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteMilestone = (projectTypeId: string, milestoneId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_MILESTONE(projectTypeId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPE_MILESTONES, projectTypeId],
      });
    },
  });
};

export default useDeleteMilestone;
