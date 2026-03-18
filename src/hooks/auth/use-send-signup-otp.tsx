import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useSendSignupOtp = () => {
  return useCustomMutation<{ message: string }, { email: string }>({
    method: "post",
    endpoint: ENDPOINTS.SEND_SIGNUP_OTP,
    showSuccessToast: false,
  });
};

export default useSendSignupOtp;
