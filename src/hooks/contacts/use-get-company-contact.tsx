import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { getUserSession } from "@/services/api.service";
import { ContactData } from "@/types/api.types";

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: ContactData;
}

// Update your hook to accept page and pageSize parameters
const useGetCompanyContacts = (page?: number, pageSize?: number) => {
  const session = getUserSession();
  const companyId = session?.company_id ?? "";
  return useQueryActionHook<ContactListResponse>({
    method: "get",
    endpoint: `${ENDPOINTS.GET_COMPANY_CONTACTS}/${companyId}${page ? `?page=${page}` : ""}${pageSize ? `&pageSize=${pageSize}` : ""}`,
    queryKey: [QUERYKEYS.GET_COMPANY_CONTACTS, `${page}`, `${pageSize}`],
  });
};

export default useGetCompanyContacts;
