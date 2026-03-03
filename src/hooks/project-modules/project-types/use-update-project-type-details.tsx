import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateProjectTypeDetails = (projectTypeId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_PROJECT_TYPE_DETAILS(projectTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPES],
      });
    },
  });
};

export default useUpdateProjectTypeDetails;
