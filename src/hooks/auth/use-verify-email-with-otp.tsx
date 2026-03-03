import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useVerifyEmailWithOtp = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      otp: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.VERIFY_EMAIL_WITH_OTP,
  });
};

export default useVerifyEmailWithOtp;
