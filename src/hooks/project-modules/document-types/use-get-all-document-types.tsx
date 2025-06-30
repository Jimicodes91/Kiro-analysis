import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { DocumentTypeDetails } from "@/types/api.types";

export interface DocumentTypeListResponse {
  success: boolean;
  message: string;
  data: DocumentTypeDetails[];
}

const useGetAllDocumentTypes = () => {
  return useQueryActionHook<DocumentTypeListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_DOCUMENT_TYPES,
    queryKey: [QUERYKEYS.GET_DOCUMENT_TYPES],
  });
};

export default useGetAllDocumentTypes;
