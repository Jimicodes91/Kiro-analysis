import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetAllCompanies = () => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_COMPANIES,
    queryKey: [QUERYKEYS.GET_ALL_COMPANIES],
  });
};

export default useGetAllCompanies;
