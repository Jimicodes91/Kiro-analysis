import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface UpdateDocumentRequest {
  description?: string;
  file_name?: string;
  document_type_id?: string;
}

const useUpdateDocument = (projectId: string, documentId: string) => {
  return useCustomMutation<Record<string, string>, UpdateDocumentRequest>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_DOCUMENT_DETAILS(projectId, documentId),
  });
};

export default useUpdateDocument;

// TODO => Ask Backend Developer
// 1. If the document_type_id is provided in the request, it should be updated in the database.
// 2. If the document_type_id is not provided in the request, it should be set to "custom_field" in the database.
// 3. If the existing document has document_type_id = "custom_field", it should be updated to the new value provided in the request.
// 4. If the existing document has document_type_id = "custom_field" and the request does not provide a new value, it should remain as "custom_field".
// 5. If the existing document has document_type_id = "custom_field" and the request provides a new value, it should be updated to the new value.

// Edge Case Handling
// If both conditions are met:

// document_type_id is provided in the request AND

// The existing document has document_type_id = "custom_field"
