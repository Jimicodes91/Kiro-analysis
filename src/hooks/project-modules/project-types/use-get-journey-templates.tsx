import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

export interface JourneyTemplate {
  name: string;
  milestones: Array<{ name: string; duration: number }>;
}

export interface IJourneyTemplatesResponse {
  success: boolean;
  message: string;
  data: JourneyTemplate[];
}

const useGetJourneyTemplates = () => {
  return useQueryActionHook<IJourneyTemplatesResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_JOURNEY_TEMPLATES,
    queryKey: [QUERYKEYS.GET_JOURNEY_TEMPLATES],
  });
};

export default useGetJourneyTemplates;
