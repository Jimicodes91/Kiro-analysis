import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Setting } from "@/types/api.types";

export interface ProjectSettingsResponse {
  success: boolean;
  message: string;
  data: Setting;
}

const useGetProjectSettings = (projectId: string) => {
  return useQueryActionHook<ProjectSettingsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_PROJECT_SETTINGS(projectId),
    queryKey: [QUERYKEYS.GET_PROJECT_SETTINGS, projectId],
  });
};

export default useGetProjectSettings;
