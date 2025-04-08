import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetAllProjectTypeMilestones = (projectTypeId: string) => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_TYPE_MILESTONES(projectTypeId),
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPE_MILESTONES, projectTypeId],
  });
};

export default useGetAllProjectTypeMilestones;
