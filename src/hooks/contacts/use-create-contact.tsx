import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

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
  return useCustomMutation<Record<string, string>, CreateContactRequest>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_CONTACT,
  });
};

export default useCreateContact;
