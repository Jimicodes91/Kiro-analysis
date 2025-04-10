import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface CreateCommentRequest {
  content: string;
}

const useAddComment = (projectId: string, noteId: string) => {
  return useCustomMutation<Record<string, string>, CreateCommentRequest>({
    method: "post",
    endpoint: ENDPOINTS.ADD_NOTE_COMMENT(projectId, noteId),
  });
};

export default useAddComment;
