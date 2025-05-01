import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Member } from "@/types/api.types";

export interface MemberListResponse {
  success: boolean;
  message: string;
  data: Member[];
}

const useGetProjectMembers = (projectId: string) => {
  return useQueryActionHook<MemberListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_PROJECT_MEMBERS(projectId),
    queryKey: [QUERYKEYS.GET_PROJECT_MEMBERS, projectId],
  });
};

export default useGetProjectMembers;
