import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface ISendInvite {
  role: string;
  email: string;
}

const useSendConsultantInvite = () => {
  return useCustomMutation<Record<string, string>, ISendInvite>({
    method: "post",
    endpoint: ENDPOINTS.SEND_CONSULTANT_INVITE,
  });
};

export default useSendConsultantInvite;
