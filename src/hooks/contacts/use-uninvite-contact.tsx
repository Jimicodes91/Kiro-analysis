import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

const useUninviteContact = (contactId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "post",
    endpoint: ENDPOINTS.UNINVITE_CONTACT(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_COMPANY_CONTACTS],
      });
    },
  });
};

export default useUninviteContact;
