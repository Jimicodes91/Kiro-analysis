import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { NativeFormsSubmission } from "@/types/nativeforms.types";

function useGetSubmissionsByProject(projectId: string) {
  return useQueryActionHook<NativeFormsSubmission[]>({
    endpoint: ENDPOINTS.GET_NATIVEFORMS_SUBMISSIONS_BY_PROJECT(projectId),
    queryKey: [QUERYKEYS.GET_NATIVEFORMS_SUBMISSIONS_BY_PROJECT, projectId],
    enabled: !!projectId,
  });
}

export default useGetSubmissionsByProject;
