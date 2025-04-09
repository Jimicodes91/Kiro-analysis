import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface UploadDocumentRequest {
  document_type_id: string;
  file_name: string;
  description: string;
  attachment: string;
}

const useUploadDocument = (projectId: string) => {
  return useCustomMutation<Record<string, string>, UploadDocumentRequest>({
    method: "post",
    endpoint: ENDPOINTS.UPLOAD_DOCUMENT(projectId),
  });
};

export default useUploadDocument;
