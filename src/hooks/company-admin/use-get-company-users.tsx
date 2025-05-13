import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { getUserSession } from "@/services/api.service";
import { UserDetails } from "@/types/api.types";

export interface IUserList {
  success: boolean;
  message: string;
  data: UserDetails[];
}

const useGetCompanyUsers = () => {
  const session = getUserSession();
  const companyId = session?.company_id ?? "";

  return useQueryActionHook<IUserList>({
    method: "get",
    endpoint: ENDPOINTS.GET_COMPANY_USERS(companyId),
    queryKey: [QUERYKEYS.GET_COMPANY_USERS],
  });
};

export default useGetCompanyUsers;
