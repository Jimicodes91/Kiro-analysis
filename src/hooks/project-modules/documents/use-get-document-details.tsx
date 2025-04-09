import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Document } from "@/types/api.types";

export interface DocumentDetailsResponse {
  success: boolean;
  message: string;
  data: Document;
}

const useGetProjectDocumentDetails = (projectId: string, documentId: string) => {
  return useQueryActionHook<DocumentDetailsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_DOCUMENT_DETAILS(projectId, documentId),
    queryKey: [QUERYKEYS.GET_DOCUMENT_DETAILS, projectId, documentId],
  });
};

export default useGetProjectDocumentDetails;
