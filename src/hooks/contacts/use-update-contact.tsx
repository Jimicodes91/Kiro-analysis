import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export interface AssignTo {
  id: string;
  name: string;
}
export interface UpdateContactRequest {
  name: string;
  phone: string;
  email: string;
  company_id: string;
  assigned_to: AssignTo[];
}
const useUpdateContact = (contactId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<object, UpdateContactRequest>({
    method: "put",
    endpoint: ENDPOINTS.UPDATE_CONTACT(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_CONTACTS],
      });
    },
  });
};

export default useUpdateContact;
