import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
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

export interface Feature {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
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
