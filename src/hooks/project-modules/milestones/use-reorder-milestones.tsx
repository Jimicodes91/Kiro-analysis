import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface ReorderMilestonesRequest {
  milestone_ids: string[];
}

const useReorderMilestones = (projectTypeId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, ReorderMilestonesRequest>({
    method: "patch",
    endpoint: ENDPOINTS.REORDER_MILESTONES(projectTypeId),
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

export default useReorderMilestones;
