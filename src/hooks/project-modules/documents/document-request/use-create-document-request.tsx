import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface CreateDocumentRequest {
  document_type_id: string;
  assignee_id: string;
  name: string;
  description: string;
  is_visible_to_client: boolean;
  end_date: string;
}

const useCreateDocumentRequest = (projectId: string) => {
  return useCustomMutation<Record<string, string>, CreateDocumentRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_DOCUMENT_REQUEST(projectId),
  });
};

export default useCreateDocumentRequest;
