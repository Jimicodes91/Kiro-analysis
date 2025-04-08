import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useResetPassword = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      token: string;
      newPassword: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.RESET_PASSWORD,
  });
};

export default useResetPassword;
