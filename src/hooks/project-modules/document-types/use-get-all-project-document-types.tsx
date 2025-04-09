import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { DocumentTypeDetails } from "@/types/api.types";

export interface DocumentTypeListResponse {
  success: boolean;
  message: string;
  data: DocumentTypeDetails[];
}

const useGetAllProjectDocumentTypes = (projectId: string) => {
  return useQueryActionHook<DocumentTypeListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_DOCUMENT_TYPES(projectId),
    queryKey: [QUERYKEYS.GET_DOCUMENT_TYPES, projectId],
  });
};

export default useGetAllProjectDocumentTypes;
