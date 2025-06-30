import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

export interface ProjectTypeMilestones {
  success: boolean;
  message: string;
  data: ProjectTypeMilestone[];
}

export interface ProjectTypeMilestone {
  id: string;
  created_at: string;
  updated_at: string;
  project_type_id: string;
  company_id: string;
  duration: number;
  name: string;
  is_system: number;
  projects: string[];
  status: string;
}

const useGetAllProjectTypeMilestones = (projectTypeId: string) => {
  return useQueryActionHook<ProjectTypeMilestones>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_TYPE_MILESTONES(projectTypeId),
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPE_MILESTONES, projectTypeId],
  });
};

export default useGetAllProjectTypeMilestones;
