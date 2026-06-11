import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export type ProjectMemberType = "internal" | "client";
export interface AddProjectMember {
  user_id: string;
  is_visible_to_client: boolean;
  member_type: ProjectMemberType;
  send_notification?: boolean;
}

const useAddProjectMember = (projectId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, AddProjectMember>({
    method: "post",
    endpoint: ENDPOINTS.ADD_PROJECT_MEMBER(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_PROJECT_MEMBERS],
      });
    },
  });
};

export default useAddProjectMember;
