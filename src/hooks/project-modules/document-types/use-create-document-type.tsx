import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useCreateDocumentType = () => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      description: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_DOCUMENT_TYPE,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_DOCUMENT_TYPES],
      });
    },
  });
};

export default useCreateDocumentType;
