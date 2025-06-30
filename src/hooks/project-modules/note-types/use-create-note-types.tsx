import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useCreateNoteType = () => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      description: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_NOTE_TYPE,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_NOTE_TYPES],
      });
    },
  });
};

export default useCreateNoteType;
