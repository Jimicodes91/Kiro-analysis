import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useCreateEventType = (projectId: string) => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
      description: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_EVENT_TYPE(projectId),
  });
};

export default useCreateEventType;
