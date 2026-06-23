import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";
import { UpdateFormLinkRequest } from "@/types/nativeforms.types";

function useUpdateFormLink(id: string) {
  return useCustomMutation<Record<string, unknown>, UpdateFormLinkRequest>({
    endpoint: ENDPOINTS.UPDATE_NATIVEFORMS_FORM_LINK(id),
    method: "PATCH",
    message: "Form link updated successfully",
  });
}

export default useUpdateFormLink;
