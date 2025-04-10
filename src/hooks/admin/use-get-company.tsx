import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetCompanyDetails = (companyId: string) => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_COMPANY_DETAILS(companyId),
    queryKey: [QUERYKEYS.GET_COMPANY_DETAILS, companyId],
  });
};

export default useGetCompanyDetails;
