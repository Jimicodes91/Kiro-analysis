import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetprojectTypeDetails = (projectTypeId: string) => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_PROJECT_TYPE_DETAILS(projectTypeId),
    queryKey: [QUERYKEYS.GET_PROJECT_TYPE_DETAILS, projectTypeId],
  });
};

export default useGetprojectTypeDetails;
