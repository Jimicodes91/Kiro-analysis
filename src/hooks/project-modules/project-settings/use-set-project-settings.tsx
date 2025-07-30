import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export interface ProjectSettings {
  client_can_view_task: boolean;
  client_can_view_notes: boolean;
  client_can_view_documents: boolean;
  client_can_view_activity: boolean;
  client_can_view_event: boolean;
  client_can_view_project_members: boolean;
}

const useSetProjectSettings = (projectId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<object, Partial<ProjectSettings>>({
    method: "patch",
    endpoint: ENDPOINTS.SET_PROJECT_SETTINGS(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_PROJECT_SETTINGS, projectId],
      });
    },
  });
};

export default useSetProjectSettings;
