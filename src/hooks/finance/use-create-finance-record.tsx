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

const useCreateFinanceRecord = () => {
  const queryClient = useQueryClient();
  return useCustomMutation<Record<string, string>, BillingRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_FINANCE_RECORD,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_FINANCE_RECORDS],
      });
    },
  });
};

export default useCreateFinanceRecord;
