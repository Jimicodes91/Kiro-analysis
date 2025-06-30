import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, ProjectStatusDict, QUERYKEYS } from "@/lib/constants";
import { ProjectDetails } from "@/types/api.types";

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: ProjectDetails[];
}

const useGetAllProjects = (
  projectTypeId?: string,
  status?: ProjectStatusDict | "all",
  search?: string
) => {
  const statusKey = status ?? "";
  const searchKey = search ?? "";
  const projectTypeIdKey = projectTypeId ?? "";
  return useQueryActionHook<ProjectListResponse>({
    method: "get",
    enabled: Boolean(projectTypeId),
    endpoint: ENDPOINTS.GET_ALL_PROJECTS(projectTypeId, status, search),
    queryKey: [QUERYKEYS.GET_ALL_PROJECTS, projectTypeIdKey, statusKey, searchKey],
    refetchOnWindowFocus: true,
  });
};

export default useGetAllProjects;
