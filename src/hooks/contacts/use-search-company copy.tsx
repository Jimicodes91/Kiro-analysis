import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { getUserSession } from "@/services/api.service";
import { ContactData } from "@/types/api.types";

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: ContactData;
}

const useSearchCompanyContacts = (page?: number, pageSize?: number, search?: string) => {
  const session = getUserSession();
  const companyId = session?.company_id ?? "";
  return useQueryActionHook<ContactListResponse>({
    method: "get",
    endpoint: `${ENDPOINTS.SEARCH_COMPANY_CONTACTS}?companyId=${companyId}${page ? `&page=${page}` : ""}${pageSize ? `&pageSize=${pageSize}` : ""}${search ? `&q=${search}` : ""}`,
    queryKey: [QUERYKEYS.GET_COMPANY_CONTACTS, `${page}`, `${pageSize}`, `${search}`],
  });
};

export default useSearchCompanyContacts;
