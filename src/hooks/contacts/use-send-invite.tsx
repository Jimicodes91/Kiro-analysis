import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { InviteResponse } from "@/types/contact.types";
import { useQueryClient } from "@tanstack/react-query";

export interface SendInviteRequest {
  custom_message?: string;
}

const useSendInvite = (contactId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<InviteResponse, SendInviteRequest>({
    method: "post",
    endpoint: ENDPOINTS.SEND_CONTACT_INVITE(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_COMPANY_CONTACTS],
      });
    },
  });
};

export default useSendInvite;
