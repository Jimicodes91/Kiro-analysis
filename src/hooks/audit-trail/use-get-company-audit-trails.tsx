import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Activity } from "@/types/api.types";

export interface AuditTrailResponse {
  success: boolean;
  message: string;
  data: Activity;
}

const useGetCompanyAuditTrail = (page: number, limit: number, action?: string) => {
  return useQueryActionHook<AuditTrailResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_AUDIT_TRAIL(page, limit, action),
    queryKey: [QUERYKEYS.GET_ALL_AUDIT_TRAIL, `${page}`, `${limit}`, `${action}`],
  });
};

export default useGetCompanyAuditTrail;

export enum AUDIT_TRAIL_ACTION {
  TASK_ADDED = "TASK_ADDED",
  NOTE_PINNED = "NOTE_PINNED",
  NOTE_CREATED = "NOTE_CREATED",
  COMMENT_CREATED = "COMMENT_CREATED",
  COMMENT_DELETED = "COMMENT_DELETED",
}
