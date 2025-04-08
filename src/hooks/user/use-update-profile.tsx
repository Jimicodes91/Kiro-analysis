import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useUpdateProfile = (userId: string) => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      email: string;
      password: string;
    }
  >({
    method: "put",
    endpoint: ENDPOINTS.UPDATE_PROFILE(userId),
  });
};

export default useUpdateProfile;
