import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { SubscriptionPlan } from "@/types/api.types";

export interface SubscriptionPlanResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
}

const useGetAllPlans = () => {
  return useQueryActionHook<SubscriptionPlanResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PLANS,
    queryKey: [QUERYKEYS.GET_ALL_PLANS],
  });
};

export default useGetAllPlans;
