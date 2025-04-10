import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useUpdateProject = (projectId: string) => {
  return useCustomMutation<Record<string, string>>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_PROJECT_DETAILS(projectId),
  });
};

export default useUpdateProject;
