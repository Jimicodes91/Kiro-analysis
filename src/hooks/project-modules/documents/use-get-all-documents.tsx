import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { IDocument } from "@/types/api.types";

export interface DocumentListResponse {
  success: boolean;
  message: string;
  data: IDocument[];
}

const useGetAllProjectDocuments = (projectId: string) => {
  return useQueryActionHook<DocumentListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_DOCUMENTS(projectId),
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_DOCUMENTS, projectId],
  });
};

export default useGetAllProjectDocuments;
