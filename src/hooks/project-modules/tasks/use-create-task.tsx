import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export interface CreateTaskRequest {
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  attachments: string[];
  is_visible_to_client: boolean;
  project_type_id: string;
  task_type_id: string;
  assignees: string[];
}

const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, CreateTaskRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_TASK(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TASKS],
      });
    },
  });
};

export default useCreateTask;
