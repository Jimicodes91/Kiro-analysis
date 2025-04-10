import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetActiveUsers = () => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_ACTIVE_USERS,
    queryKey: [QUERYKEYS.GET_ACTIVE_USERS],
  });
};

export default useGetActiveUsers;
