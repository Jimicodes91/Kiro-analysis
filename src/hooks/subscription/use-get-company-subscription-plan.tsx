import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

export interface PlanResponse {
  success: boolean;
  message: string;
  data: {
    plan: "PREMIUM";
    payment_method_id: "pm_premium_test_123456";
  };
}

const useGetCompanySubscription = (companyId: string) => {
  return useQueryActionHook<PlanResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_COMPANY_SUBSCRIPTION_PLAN(companyId),
    queryKey: [QUERYKEYS.GET_COMPANY_SUBSCRIPTION_PLAN, companyId],
  });
};

export default useGetCompanySubscription;
