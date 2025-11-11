import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteProjectType = (projectTypeId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_PROJECT_TYPE(projectTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPES],
      });
    },
  });
};

export default useDeleteProjectType;
