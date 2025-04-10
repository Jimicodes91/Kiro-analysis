import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useRemoveProjectMember = (projectId: string, memberId: string) => {
  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.REMOVE_PROJECT_MEMBER(projectId, memberId),
  });
};

export default useRemoveProjectMember;
