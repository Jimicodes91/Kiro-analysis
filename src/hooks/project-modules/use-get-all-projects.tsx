import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, ProjectStatus, QUERYKEYS } from "@/lib/constants";
import { ProjectDetails } from "@/types/api.types";

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: ProjectDetails[];
}

const useGetAllProjects = (projectTypeId?: string, status?: ProjectStatus) => {
  const statusKey = status ?? "";
  const projectTypeIdKey = projectTypeId ?? "";
  return useQueryActionHook<ProjectListResponse>({
    method: "get",
    enabled: Boolean(projectTypeId),
    endpoint: ENDPOINTS.GET_ALL_PROJECTS(projectTypeId, status),
    queryKey: [QUERYKEYS.GET_ALL_PROJECTS, projectTypeIdKey, statusKey],
  });
};

export default useGetAllProjects;
