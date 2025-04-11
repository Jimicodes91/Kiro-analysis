import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useForgotPassword = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      email: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.FORGOT_PASSWORD,
    message: "Reset link sent",
  });
};

export default useForgotPassword;
