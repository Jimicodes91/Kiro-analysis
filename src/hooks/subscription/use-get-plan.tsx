import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { SubscriptionPlan } from "@/types/api.types";

export interface PlanResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan;
}

const useGetPlan = (planType: string) => {
  return useQueryActionHook<PlanResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_PLAN(planType),
    queryKey: [QUERYKEYS.GET_PLAN, planType],
  });
};

export default useGetPlan;
