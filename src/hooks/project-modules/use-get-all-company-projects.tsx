import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { ProjectDetails } from "@/types/api.types";

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: ProjectDetails[];
}

const useGetAllCompanyProjects = () => {
  return useQueryActionHook<ProjectListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECTS(),
    queryKey: [QUERYKEYS.GET_ALL_PROJECTS],
  });
};

export default useGetAllCompanyProjects;
