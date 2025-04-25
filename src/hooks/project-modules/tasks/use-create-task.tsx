import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface CreateTaskRequest {
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  attachments: string[];
  is_visible_to_client: boolean;
}

const useCreateTask = (projectId: string) => {
  return useCustomMutation<Record<string, string>, CreateTaskRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_TASK(projectId),
  });
};

export default useCreateTask;
