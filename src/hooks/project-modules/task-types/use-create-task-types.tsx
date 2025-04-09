import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useCreateTaskType = (projectId: string) => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      description: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_TASK_TYPE(projectId),
  });
};

export default useCreateTaskType;
