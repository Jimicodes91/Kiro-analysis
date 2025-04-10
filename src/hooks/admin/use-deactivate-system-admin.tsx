import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useDeactivateSystemAdmin = (adminId: string) => {
  return useCustomMutation({
    method: "patch",
    endpoint: ENDPOINTS.DEACTIVATE_SYSTEM_ADMIN(adminId),
  });
};

export default useDeactivateSystemAdmin;
