import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { NoteDetails } from "@/types/api.types";

export interface NoteListResponse {
  success: boolean;
  message: string;
  data: NoteDetails[];
}

const useGetPlan = (planType: string) => {
  return useQueryActionHook<NoteListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_PLAN(planType),
    queryKey: [QUERYKEYS.GET_PLAN, planType],
  });
};

export default useGetPlan;
