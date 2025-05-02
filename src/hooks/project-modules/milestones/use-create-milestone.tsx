import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useCreateMilestone = () => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      duration: string;
      project_type_id: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_MILESTONE,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPES],
      });
    },
  });
};

export default useCreateMilestone;
