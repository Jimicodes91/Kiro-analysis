import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { ContactDetails } from "@/types/api.types";

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: ContactDetails[];
}

const useGetAllContacts = () => {
  return useQueryActionHook<ContactListResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_CONTACTS,
    queryKey: [QUERYKEYS.GET_ALL_CONTACTS],
  });
};

export default useGetAllContacts;
