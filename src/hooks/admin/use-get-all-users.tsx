import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { UserDetails } from "@/types/api.types";

export interface IUserList {
  success: boolean;
  message: string;
  data: UserDetails[];
}

const useGetAllUsers = () => {
  return useQueryActionHook<IUserList>({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_USERS,
    queryKey: [QUERYKEYS.GET_ALL_USERS],
  });
};

export default useGetAllUsers;
