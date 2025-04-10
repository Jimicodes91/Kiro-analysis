import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetAllUsers = () => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_USERS,
    queryKey: [QUERYKEYS.GET_ALL_USERS],
  });
};

export default useGetAllUsers;
