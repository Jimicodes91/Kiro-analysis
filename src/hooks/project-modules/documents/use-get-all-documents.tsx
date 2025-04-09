import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

export interface DocumentListResponse {
  success: boolean;
  message: string;
  data: Document[];
}

const useGetAllProjectDocuments = (projectId: string) => {
  return useQueryActionHook<DocumentListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_DOCUMENTS(projectId),
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_DOCUMENTS, projectId],
  });
};

export default useGetAllProjectDocuments;
