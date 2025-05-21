import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { NoteDetails } from "@/types/api.types";

export interface NoteListResponse {
  success: boolean;
  message: string;
  data: NoteDetails[];
}

const useGetAllPlans = () => {
  return useQueryActionHook<NoteListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PLANS,
    queryKey: [QUERYKEYS.GET_ALL_PLANS],
  });
};

export default useGetAllPlans;
