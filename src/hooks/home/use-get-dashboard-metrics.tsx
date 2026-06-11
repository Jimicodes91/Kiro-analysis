import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS } from "@/lib/constants";
import { DashboardData } from "@/types/api.types";

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

const useGetDashboardMetrics = () => {
  return useQueryActionHook<DashboardResponse>({
    method: "get",
    endpoint: `${ENDPOINTS.GET_DASHBOARD_METRICS}`,
    refetchInterval: 60000,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};

export default useGetDashboardMetrics;
