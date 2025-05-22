import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, ProjectStatusDict, QUERYKEYS } from "@/lib/constants";
import { ProjectDetails } from "@/types/api.types";

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: ProjectDetails[];
}

const useGetClientProjects = (clientId: string, status?: ProjectStatusDict | "all") => {
  const statusKey = status ?? "";

  return useQueryActionHook<ProjectListResponse>({
    method: "get",
    enabled: Boolean(clientId),
    endpoint: ENDPOINTS.GET_CLIENT_PROJECTS(clientId, status),
    queryKey: [QUERYKEYS.GET_CLIENT_PROJECTS, clientId, statusKey],
    refetchOnWindowFocus: true,
  });
};

export default useGetClientProjects;
