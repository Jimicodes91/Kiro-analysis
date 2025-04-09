import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useDeleteDocument = (projectId: string, documentId: string) => {
  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_DOCUMENT(projectId, documentId),
  });
};

export default useDeleteDocument;
