import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_PROJECT_DETAILS(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_PROJECT_DETAILS, projectId],
      });
    },
  });
};

export default useUpdateProject;
