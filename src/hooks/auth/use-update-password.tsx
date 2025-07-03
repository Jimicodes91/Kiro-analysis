import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useUpdatePassword = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      currentPassword: string;
      newPassword: string;
      userId: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.UPDATE_PASSWORD,
  });
};

export default useUpdatePassword;
