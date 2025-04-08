import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useAdminSignup = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      email: string;
      password: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.ADMIN_SIGNUP,
  });
};

export default useAdminSignup;
