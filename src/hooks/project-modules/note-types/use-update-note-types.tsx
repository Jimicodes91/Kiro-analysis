import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateNoteType = (noteTypeId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    {
      name?: string;
      description?: string;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_NOTE_TYPE(noteTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_NOTE_TYPES],
      });
    },
  });
};

export default useUpdateNoteType;
