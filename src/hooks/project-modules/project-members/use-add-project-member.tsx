import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface AddProjectMember {
  user_id: string;
  is_visible_to_client: boolean;
}

const useAddProjectMember = (projectId: string) => {
  return useCustomMutation<Record<string, string>, AddProjectMember>({
    method: "post",
    endpoint: ENDPOINTS.ADD_PROJECT_MEMBER(projectId),
  });
};

export default useAddProjectMember;
