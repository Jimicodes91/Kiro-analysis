import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateFormSubmission = () => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "post",
    endpoint: ENDPOINTS.CREATE_FORM_SUBMISSION,
    showSuccessToast: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_SUBMISSIONS_BY_TASK] });
    },
  });
};

export const useFinalizeFormSubmission = (submissionId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "patch",
    endpoint: ENDPOINTS.FINALIZE_FORM_SUBMISSION(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERYKEYS.GET_FORM_SUBMISSIONS_BY_TASK] });
    },
  });
};
