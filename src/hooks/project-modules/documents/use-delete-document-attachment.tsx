import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useDeleteDocumentAttachment = (
  projectId: string,
  documentId: string,
  attachmentId: string
) => {
  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_DOCUMENT_ATTACHMENT(projectId, documentId, attachmentId),
  });
};

export default useDeleteDocumentAttachment;
