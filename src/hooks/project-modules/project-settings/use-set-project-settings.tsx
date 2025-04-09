import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface ProjectSettings {
  client_can_view_task: boolean;
  client_can_view_notes: boolean;
  client_can_view_documents: boolean;
  client_can_view_activity: boolean;
}

const useSetProjectSettings = (projectId: string) => {
  return useCustomMutation<object, ProjectSettings>({
    method: "patch",
    endpoint: ENDPOINTS.SET_PROJECT_SETTINGS(projectId),
  });
};

export default useSetProjectSettings;
