import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { ContactData } from "@/types/api.types";

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: ContactData;
}

// Update your hook to accept page and pageSize parameters
const useGetAllContacts = (page: number = 1, pageSize: number = 20) => {
  return useQueryActionHook<ContactListResponse>({
    method: "get",
    endpoint: `${ENDPOINTS.GET_ALL_CONTACTS}?page=${page}&pageSize=${pageSize}`,
    queryKey: [QUERYKEYS.GET_ALL_CONTACTS, `${page}`, `${pageSize}`],
  });
};

export default useGetAllContacts;
