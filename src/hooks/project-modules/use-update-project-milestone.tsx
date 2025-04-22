import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
//
const useUpdateProjectMilestone = (projectId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      milestone_id: string;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_PROJECT_MILESTONE(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECTS],
      });
    },
  });
};

export default useUpdateProjectMilestone;
