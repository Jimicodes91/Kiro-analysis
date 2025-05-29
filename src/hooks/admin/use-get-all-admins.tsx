import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { UserDetails } from "@/types/api.types";

export interface IUserList {
  success: boolean;
  message: string;
  data: UserDetails[];
}

const useGetAllSysAdmins = (page?: number, pageSize?: number, search?: string) => {
  return useQueryActionHook<IUserList>({
    method: "get",
    endpoint: `${ENDPOINTS.GET_ALL_SYSADMINS}${page ? `?page=${page}` : ""}${pageSize ? `&pageSize=${pageSize}` : ""}${search ? `&search=${search}` : ""}`,
    queryKey: [QUERYKEYS.GET_ALL_SYSADMINS],
  });
};

export default useGetAllSysAdmins;
