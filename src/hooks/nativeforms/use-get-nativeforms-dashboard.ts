import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { NativeFormsDashboardStats } from "@/types/nativeforms.types";

function useGetNativeformsDashboard() {
  return useQueryActionHook<NativeFormsDashboardStats>({
    endpoint: ENDPOINTS.GET_NATIVEFORMS_DASHBOARD,
    queryKey: [QUERYKEYS.GET_NATIVEFORMS_DASHBOARD],
  });
}

export default useGetNativeformsDashboard;
