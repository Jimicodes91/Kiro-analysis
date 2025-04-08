import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useResendVerificationEmail = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      email: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.RESEND_VERIFICATION_EMAIL,
  });
};

export default useResendVerificationEmail;
