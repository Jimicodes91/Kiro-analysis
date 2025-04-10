import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useDeleteComment = (projectId: string, noteId: string, commentId: string) => {
  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_NOTE_COMMENT(projectId, noteId, commentId),
  });
};

export default useDeleteComment;
