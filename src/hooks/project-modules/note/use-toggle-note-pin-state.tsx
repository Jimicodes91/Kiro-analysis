import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

interface ToggleNoteState {
  is_pinned: boolean;
}

const useToggleNotePinState = (projectId: string, noteId: string) => {
  return useCustomMutation<Record<string, string>, ToggleNoteState>({
    method: "patch",
    endpoint: ENDPOINTS.TOGGLE_NOTE_PIN_STATE(projectId, noteId),
  });
};

export default useToggleNotePinState;
