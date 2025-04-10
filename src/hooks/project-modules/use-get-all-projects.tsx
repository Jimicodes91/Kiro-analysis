import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, ProjectStatus, QUERYKEYS } from "@/lib/constants";
import { ProjectDetails } from "@/types/api.types";

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: ProjectDetails[];
}

const useGetAllProjects = (projectTypeId: string, status: ProjectStatus) => {
  return useQueryActionHook<ProjectListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECTS(projectTypeId, status),
    queryKey: [QUERYKEYS.GET_ALL_PROJECTS, projectTypeId, status],
  });
};

export default useGetAllProjects;
