import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useCompleteRegistration = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      email: string;
      role: string;
      password: string;
      companyId: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.COMPLETE_REGISTRATION,
  });
};

export default useCompleteRegistration;
