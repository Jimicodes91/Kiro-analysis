import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Member } from "@/types/api.types";
import { ProjectMemberType } from "./use-add-project-member";

export interface MemberListResponse {
  success: boolean;
  message: string;
  data: Member[];
}

const useGetProjectMembers = (projectId: string, memberType?: ProjectMemberType) => {
  return useQueryActionHook<MemberListResponse>({
    method: "get",
    endpoint: `${ENDPOINTS.GET_PROJECT_MEMBERS(projectId)}${memberType ? `?member_type=${memberType}` : ""}`,
    queryKey: [QUERYKEYS.GET_PROJECT_MEMBERS, projectId, `${memberType}`],
  });
};

export default useGetProjectMembers;
