import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface WorkspaceSignupResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      is_primary_admin: boolean;
      workspace_id: string;
    };
    workspace: {
      id: string;
      name: string;
      status: string;
    };
    token: string;
  };
}

const useWorkspaceSignup = () => {
  return useCustomMutation<
    WorkspaceSignupResponse,
    {
      email: string;
      password: string;
      name: string;
      workspace_name: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.WORKSPACE_SIGNUP,
  });
};

export default useWorkspaceSignup;
