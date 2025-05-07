import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

export interface AssignTo {
  id: string;
  name: string;
}
export interface CreateContactRequest {
  name: string;
  phone: string;
  email: string;
  organization: string;
  assigned_to: AssignTo[];
}

const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useCustomMutation<Record<string, string>, CreateContactRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_CONTACT,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_CONTACTS],
      });
    },
  });
};

export default useCreateContact;
