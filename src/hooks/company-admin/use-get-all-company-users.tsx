import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { UserDetails } from "@/types/api.types";

export interface IUserList {
  success: boolean;
  message: string;
  data: {
    data: UserDetails[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

const useGetAllCompanyUsers = (
  page?: number,
  pageSize?: number,
  givenCompanyId?: string
) => {
  return useQueryActionHook<IUserList>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_COMPANY_USERS(givenCompanyId ?? "", page, pageSize),
    enabled: !!givenCompanyId,
    queryKey: [
      QUERYKEYS.GET_ALL_COMPANY_USERS,
      `${page}`,
      `${pageSize}`,
      `${givenCompanyId}`,
    ],
  });
};

export default useGetAllCompanyUsers;
