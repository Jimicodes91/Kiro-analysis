import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useVerifySignupOtp = () => {
  return useCustomMutation<{ signup_token: string }, { email: string; otp: string }>({
    method: "post",
    endpoint: ENDPOINTS.VERIFY_SIGNUP_OTP,
    showSuccessToast: false,
  });
};

export default useVerifySignupOtp;
