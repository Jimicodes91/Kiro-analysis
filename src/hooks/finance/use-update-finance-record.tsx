import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

interface BillingRequest {
  client_name: string;
  project_title: string;
  total_project_cost: string;
  amount_paid: string;
  outstanding_balance: string;
  next_payment_due_date: string;
  organization_id: string;
}
const useUpdateFinanceRecord = (financeId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<object, BillingRequest>({
    method: "put",
    endpoint: ENDPOINTS.UPDATE_FINANCE_RECORD(financeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_FINANCE_RECORDS],
      });
    },
  });
};

export default useUpdateFinanceRecord;
