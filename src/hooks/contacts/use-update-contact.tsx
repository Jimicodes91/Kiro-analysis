import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface AssignTo {
  id: string;
  name: string;
}
export interface UpdateContactRequest {
  name: string;
  phone: string;
  email: string;
  organization: string;
  assigned_to: AssignTo[];
}
const useUpdateContact = (contactId: string) => {
  return useCustomMutation<object, UpdateContactRequest>({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_CONTACT(contactId),
  });
};

export default useUpdateContact;
