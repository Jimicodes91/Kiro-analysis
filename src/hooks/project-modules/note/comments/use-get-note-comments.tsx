import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { CommentDetails } from "@/types/api.types";

export interface CommentsListResponse {
  success: boolean;
  message: string;
  data: CommentDetails[];
}

const useGetNoteComments = (projectId: string, noteId: string) => {
  return useQueryActionHook<CommentsListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_NOTE_COMMENTS(projectId, noteId),
    queryKey: [QUERYKEYS.GET_NOTE_COMMENTS, projectId, noteId],
  });
};

export default useGetNoteComments;
