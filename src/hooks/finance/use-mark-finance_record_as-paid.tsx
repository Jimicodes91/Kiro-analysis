import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface BillingRequest {
  amount_paid: string;
  payment_proof: string;
}
const useMarkFinanceRecordAsPaid = (financeId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<object, BillingRequest>({
    method: "patch",
    endpoint: ENDPOINTS.MARK_FINANCE_RECORD_AS_PAID(financeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_FINANCE_RECORDS],
      });
    },
  });
};

export default useMarkFinanceRecordAsPaid;
