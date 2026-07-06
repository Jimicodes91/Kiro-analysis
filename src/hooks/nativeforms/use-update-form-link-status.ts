import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

function useUpdateFormLinkStatus(id: string) {
  return useCustomMutation({
    endpoint: ENDPOINTS.UPDATE_NATIVEFORMS_FORM_LINK_STATUS(id),
    method: "PATCH",
    message: "Form link status updated",
  });
}

export default useUpdateFormLinkStatus;
