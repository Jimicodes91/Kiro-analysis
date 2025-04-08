import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useCompanyAdminSignup = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      email: string;
      password: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.COMPANY_ADMIN_SIGNUP,
  });
};

export default useCompanyAdminSignup;
