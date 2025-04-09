import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Activity } from "@/types/api.types";

export interface AuditTrailResponse {
  success: boolean;
  message: string;
  data: Activity;
}

const useGetAuditTrail = (projectId: string, page: number, limit: number) => {
  return useQueryActionHook<AuditTrailResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_AUDIT_TRAIL(projectId, page, limit),
    queryKey: [QUERYKEYS.GET_AUDIT_TRAIL, projectId, `${page}`, `${limit}`],
  });
};

export default useGetAuditTrail;
