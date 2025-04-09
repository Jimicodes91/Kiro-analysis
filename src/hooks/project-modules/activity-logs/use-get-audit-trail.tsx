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

export enum AUDIT_TRAIL_ACTION {
  TASK_ADDED = "TASK_ADDED",
  NOTE_PINNED = "NOTE_PINNED",
  NOTE_CREATED = "NOTE_CREATED",
  COMMENT_CREATED = "COMMENT_CREATED",
  COMMENT_DELETED = "COMMENT_DELETED",
}
