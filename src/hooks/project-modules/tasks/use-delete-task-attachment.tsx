import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useDeleteTaskAttachment = (
  projectId: string,
  taskId: string,
  attachmentId: string
) => {
  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_TASK_ATTACHMENT(projectId, taskId, attachmentId),
  });
};

export default useDeleteTaskAttachment;
