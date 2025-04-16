import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

export interface IProjectTypesInterface {
  success: boolean;
  message: string;
  data: ProjectType[];
}

export interface ProjectType {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  company_id: string;
  name: string;
  slug: string;
  is_system: number;
  progress_metrics: ProgressMetrics;
}

export interface ProgressMetrics {
  days_to_completion: number;
  percentage_complete: number;
}

const useGetAllProjectTypes = () => {
  return useQueryActionHook<IProjectTypesInterface>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_TYPES,
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPES],
  });
};

export default useGetAllProjectTypes;
