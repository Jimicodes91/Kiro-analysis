import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { CreateContactResponse } from "@/types/contact.types";
import { useQueryClient } from "@tanstack/react-query";

export interface AssignTo {
  id: string;
  name: string;
}

export interface CreateContactRequest {
  name: string;
  phone: string;
  email: string;
  company_id?: string;
  workspace_id?: string;
  organization?: string;
  address?: string;
  assigned_to?: AssignTo[];
  send_invite_immediately?: boolean;
  invite_message?: string;
}

const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useCustomMutation<CreateContactResponse, CreateContactRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_CONTACT,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_COMPANY_CONTACTS],
      });
    },
  });
};

export default useCreateContact;
