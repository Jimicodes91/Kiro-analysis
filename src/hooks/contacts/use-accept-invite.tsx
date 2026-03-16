import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useAcceptInvite = () => {
  return useCustomMutation<
    {
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
      contact: {
        id: string;
        status: string;
      };
      token: string;
    },
    {
      token: string;
      password: string;
      name?: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.ACCEPT_CONTACT_INVITE,
  });
};

export default useAcceptInvite;
