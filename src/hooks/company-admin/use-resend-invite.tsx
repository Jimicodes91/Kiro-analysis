import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

function useResendIvite() {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, { invitationId: string }>({
    method: "post",
    endpoint: ENDPOINTS.RESEND_INVITE,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_COMPANY_USERS],
      });
    },
  });
}

export default useResendIvite;
