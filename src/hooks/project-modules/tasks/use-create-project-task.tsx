import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export interface CreateTaskRequest {
  name: string;
  description?: string; // Optional
  status: string;
  due_date: string; // Renamed from end_date
  attachments: (string | null)[];
  visibility: 'inhouse' | 'client_facing'; // New field
  document_url?: string; // For upload task types
  is_visible_to_client?: boolean; // Deprecated, use visibility
  task_type_id?: string;
  project_type_id: string;
  assignees?: string[];
}

const useCreateProjectTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<Record<string, string>, CreateTaskRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_TASK(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TASKS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_TASKS],
      });
    },
  });
};

export default useCreateProjectTask;
