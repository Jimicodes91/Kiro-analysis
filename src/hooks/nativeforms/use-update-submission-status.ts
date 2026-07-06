import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

function useUpdateSubmissionStatus(id: string) {
  return useCustomMutation({
    endpoint: ENDPOINTS.UPDATE_NATIVEFORMS_SUBMISSION_STATUS(id),
    method: "PATCH",
    message: "Submission status updated",
  });
}

export default useUpdateSubmissionStatus;
