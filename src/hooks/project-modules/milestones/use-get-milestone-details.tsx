import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetMilestoneDetails = (projectTypeId: string, milestoneId: string) => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_MILESTONE_DETAILS(projectTypeId, milestoneId),
    queryKey: [QUERYKEYS.GET_MILESTONE_DETAILS, projectTypeId, milestoneId],
  });
};

export default useGetMilestoneDetails;
