import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { AvailableAssignee } from "@/types/task.types";

const useAvailableAssignees = (projectId: string, category: string) => {
  return useQueryActionHook<AvailableAssignee[]>({
    method: "get",
    endpoint: ENDPOINTS.GET_AVAILABLE_ASSIGNEES(projectId, category),
    queryKey: [QUERYKEYS.GET_AVAILABLE_ASSIGNEES, projectId, category],
    enabled: !!projectId && !!category,
  });
};

export default useAvailableAssignees;
