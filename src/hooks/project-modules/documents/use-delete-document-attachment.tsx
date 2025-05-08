import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useDeleteDocumentAttachment = (
  projectId: string,
  documentId: string,
  attachmentId: string
) => {
  const queryClient = useQueryClient();

  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_DOCUMENT_ATTACHMENT(projectId, documentId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_DOCUMENTS],
      });
    },
  });
};

export default useDeleteDocumentAttachment;
