import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { IndividualFinanceRecord } from "@/types/api.types";

export interface FinanceRecordResponse {
  success: boolean;
  message: string;
  data: IndividualFinanceRecord;
}

const useGetIndividualFinanceRecord = (financeId: string) => {
  return useQueryActionHook<FinanceRecordResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_INDIVIDUAL_FINANCE_RECORD(financeId),
    queryKey: [QUERYKEYS.GET_INDIVIDUAL_FINANCE_RECORD, financeId],
  });
};

export default useGetIndividualFinanceRecord;
