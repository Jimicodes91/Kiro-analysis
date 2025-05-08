import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useRemoveProjectMember = (projectId: string, memberId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.REMOVE_PROJECT_MEMBER(projectId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_PROJECT_MEMBERS],
      });
    },
  });
};

export default useRemoveProjectMember;
