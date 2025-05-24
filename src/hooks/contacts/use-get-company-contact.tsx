import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { getUserSession } from "@/services/api.service";
import { ContactData } from "@/types/api.types";

export interface ContactListResponse {
  success: boolean;
  message: string;
  data: ContactData;
}

const useGetCompanyContacts = (page?: number, pageSize?: number, search?: string) => {
  const session = getUserSession();
  const companyId = session?.company_id ?? "";
  return useQueryActionHook<ContactListResponse>({
    method: "get",
    endpoint: `${ENDPOINTS.GET_COMPANY_CONTACTS}/${companyId}${page ? `?page=${page}` : ""}${pageSize ? `&pageSize=${pageSize}` : ""}${search ? `&search=${search}` : ""}`,
    queryKey: [QUERYKEYS.GET_COMPANY_CONTACTS, `${page}`, `${pageSize}`, `${search}`],
  });
};

export default useGetCompanyContacts;
