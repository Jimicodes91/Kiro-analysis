import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useDeletePlan = (planType: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_PLAN(planType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PLANS],
      });
    },
  });
};

export default useDeletePlan;
