import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { IDocument } from "@/types/api.types";

export interface DocumentDetailsResponse {
  success: boolean;
  message: string;
  data: IDocument;
}

const useGetProjectDocumentDetails = (projectId: string, documentId: string) => {
  return useQueryActionHook<DocumentDetailsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_DOCUMENT_DETAILS(projectId, documentId),
    queryKey: [QUERYKEYS.GET_DOCUMENT_DETAILS, projectId, documentId],
  });
};

export default useGetProjectDocumentDetails;
