import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { ProjectDetails } from "@/types/api.types";

export interface ProjectDetailsResponse {
  success: boolean;
  message: string;
  data: ProjectDetails;
}

const useGetProjectDetails = (projectTypeId: string) => {
  return useQueryActionHook<ProjectDetailsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_PROJECT_DETAILS(projectTypeId),
    queryKey: [QUERYKEYS.GET_PROJECT_DETAILS, projectTypeId],
  });
};

export default useGetProjectDetails;
