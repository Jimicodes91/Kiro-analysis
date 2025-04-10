import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useSendConsultantInvite = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      role: string;
      email: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.SEND_CONSULTANT_INVITE,
  });
};

export default useSendConsultantInvite;
