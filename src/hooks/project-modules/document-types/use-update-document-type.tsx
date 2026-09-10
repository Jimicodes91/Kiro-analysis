import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateDocumentType = (documentTypeId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      name?: string;
      description?: string;
      requires_expiry?: boolean;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_DOCUMENT_TYPE(documentTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_DOCUMENT_TYPES],
      });
    },
  });
};

export default useUpdateDocumentType;
