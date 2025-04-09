import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { NoteDetails } from "@/types/api.types";

export interface NoteDetailsResponse {
  success: boolean;
  message: string;
  data: NoteDetails;
}

const useGetProjectNoteDetails = (projectId: string, noteId: string) => {
  return useQueryActionHook<NoteDetailsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_NOTE_DETAILS(projectId, noteId),
    queryKey: [QUERYKEYS.GET_NOTE_DETAILS, projectId, noteId],
  });
};

export default useGetProjectNoteDetails;
