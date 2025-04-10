import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface CancelSubscriptionRequest {
  expiryDate: string;
}

const useCancelSubscription = (companyId: string) => {
  return useCustomMutation<Record<string, string>, CancelSubscriptionRequest>({
    method: "post",
    endpoint: ENDPOINTS.CANCEL_COMPANY_SUBSCRIPTION(companyId),
  });
};

export default useCancelSubscription;
