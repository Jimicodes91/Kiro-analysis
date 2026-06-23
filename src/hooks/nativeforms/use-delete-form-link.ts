import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

function useDeleteFormLink(id: string) {
  return useCustomMutation<Record<string, unknown>, Record<string, unknown>>({
    endpoint: ENDPOINTS.DELETE_NATIVEFORMS_FORM_LINK(id),
    method: "DELETE",
    message: "Form link deleted successfully",
  });
}

export default useDeleteFormLink;
