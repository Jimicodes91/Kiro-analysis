import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface UpdateDocumentAttachmentRequest {
  attachment: File;
}

const useUpdateDocumentAttachment = (
  projectId: string,
  documentId: string,
  attachmentId: string
) => {
  return useCustomMutation<object, UpdateDocumentAttachmentRequest>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_DOCUMENT_ATTACHMENT(projectId, documentId, attachmentId),
  });
};

export default useUpdateDocumentAttachment;
