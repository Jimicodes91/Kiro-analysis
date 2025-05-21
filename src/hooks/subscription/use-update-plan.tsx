import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUpdatePlan = (planType: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation({
    method: "put",
    endpoint: ENDPOINTS.UPDATE_PLAN(planType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PLANS],
      });
    },
  });
};

export default useUpdatePlan;
