import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface CreateNoteRequest {
  content: string;
  mentions: string[];
  attachments: string[];
  is_pinned: boolean;
}

const useCreateNote = (projectId: string) => {
  return useCustomMutation<Record<string, string>, CreateNoteRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_NOTE(projectId),
  });
};

export default useCreateNote;
