import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export interface UploadDocumentRequest {
  document_type_id: string;
  file_name: string;
  description: string;
  attachment: string;
}

const useUploadDocument = (projectId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, UploadDocumentRequest>({
    method: "post",
    endpoint: ENDPOINTS.UPLOAD_DOCUMENT(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_DOCUMENTS],
      });
    },
  });
};

export default useUploadDocument;
