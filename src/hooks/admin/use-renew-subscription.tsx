import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface RenewSubscriptionRequest {
  expiryDate: string;
}

const useRenewSubscription = (companyId: string) => {
  return useCustomMutation<Record<string, string>, RenewSubscriptionRequest>({
    method: "post",
    endpoint: ENDPOINTS.RENEW_COMPANY_SUBSCRIPTION(companyId),
  });
};

export default useRenewSubscription;
