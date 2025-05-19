import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetIndividualFinanceRecord = (financeId: string) => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_INDIVIDUAL_FINANCE_RECORD(financeId),
    queryKey: [QUERYKEYS.GET_INDIVIDUAL_FINANCE_RECORD, financeId],
  });
};

export default useGetIndividualFinanceRecord;
