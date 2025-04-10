import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useCreateDocumentType = (projectId: string) => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      description: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_DOCUMENT_TYPE(projectId),
  });
};

export default useCreateDocumentType;
