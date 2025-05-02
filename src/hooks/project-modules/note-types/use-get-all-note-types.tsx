import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { TaskTypeDetails } from "@/types/api.types";

export interface NoteTypeListResponse {
  success: boolean;
  message: string;
  data: TaskTypeDetails[];
}

const useGetAllNoteTypes = () => {
  return useQueryActionHook<NoteTypeListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_NOTE_TYPES,
    queryKey: [QUERYKEYS.GET_NOTE_TYPES],
  });
};

export default useGetAllNoteTypes;
