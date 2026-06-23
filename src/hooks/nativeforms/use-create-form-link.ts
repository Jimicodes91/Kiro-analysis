import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";
import { CreateFormLinkRequest } from "@/types/nativeforms.types";

function useCreateFormLink() {
  return useCustomMutation<Record<string, unknown>, CreateFormLinkRequest>({
    endpoint: ENDPOINTS.CREATE_NATIVEFORMS_FORM_LINK,
    method: "POST",
    message: "Form link created successfully",
  });
}

export default useCreateFormLink;
