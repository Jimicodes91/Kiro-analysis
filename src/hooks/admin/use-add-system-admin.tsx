import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface AddSystemAdminRequest {
  email: string;
  name: string;
}

const useAddSystemAdmin = () => {
  return useCustomMutation<Record<string, string>, AddSystemAdminRequest>({
    method: "post",
    endpoint: ENDPOINTS.ADD_SYSTEM_ADMIN,
  });
};

export default useAddSystemAdmin;
