import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { SubmissionCheckResponse } from "@/types/nativeforms.types";

function useCheckSubmission(formLinkId: string, projectId: string) {
  return useQueryActionHook<SubmissionCheckResponse>({
    endpoint: ENDPOINTS.CHECK_NATIVEFORMS_SUBMISSION(formLinkId, projectId),
    queryKey: [QUERYKEYS.CHECK_NATIVEFORMS_SUBMISSION, formLinkId, projectId],
    enabled: !!formLinkId && !!projectId,
  });
}

export default useCheckSubmission;
