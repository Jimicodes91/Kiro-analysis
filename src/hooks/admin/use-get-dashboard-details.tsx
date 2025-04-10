import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetDashboardDetails = () => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_DASHBOARD_DETAILS,
    queryKey: [QUERYKEYS.GET_DASHBOARD_DETAILS],
  });
};

export default useGetDashboardDetails;
