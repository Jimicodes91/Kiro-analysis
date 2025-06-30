import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Pagination, UserDetails } from "@/types/api.types";

export interface IUserList {
  success: boolean;
  message: string;
  data: {
    data: UserDetails[];
    pagination: Pagination;
  };
}

const useGetAllUsers = (page?: number, pageSize?: number, search?: string) => {
  return useQueryActionHook<IUserList>({
    method: "get",
    endpoint: `${ENDPOINTS.GET_ALL_USERS}${page ? `?page=${page}` : ""}${pageSize ? `&pageSize=${pageSize}` : ""}${search ? `&search=${search}` : ""}`,
    queryKey: [QUERYKEYS.GET_ALL_USERS, `${page}`, `${pageSize}`, `${search}`],
  });
};

export default useGetAllUsers;
