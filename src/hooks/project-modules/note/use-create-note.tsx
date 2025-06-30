import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export interface CreateNoteRequest {
  content: string;
  mentions: string[];
  attachments: string[];
  is_pinned: boolean;
}
const useCreateNote = (projectId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, CreateNoteRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_NOTE(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_NOTES],
      });
    },
  });
};

export default useCreateNote;
