import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Feature } from "@/types/api.types";
import { useQueryClient } from "@tanstack/react-query";

export interface CreatePlanRequest {
  name: string;
  display_name: string;
  price: number;
  price_per_seat: boolean;
  currency: string;
  features: Feature[];
  is_active: boolean;
}

const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, CreatePlanRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_PLAN,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PLANS],
      });
    },
  });
};

export default useCreatePlan;
