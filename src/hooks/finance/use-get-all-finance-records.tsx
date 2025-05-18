import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { FinanceData } from "@/types/api.types";

export interface FinanceListResponse {
  success: boolean;
  message: string;
  data: FinanceData;
}

const useGetAllFinanceRecords = (companyId: string, page?: number, pageSize?: number) => {
  return useQueryActionHook<FinanceListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_FINANCE_RECORDS(companyId, page, pageSize),
    queryKey: [QUERYKEYS.GET_ALL_FINANCE_RECORDS, `${page}`, `${pageSize}`],
  });
};

export default useGetAllFinanceRecords;
