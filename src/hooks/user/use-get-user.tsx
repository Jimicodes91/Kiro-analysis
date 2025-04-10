import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetUser = (userId: string) => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_USER(userId),
    queryKey: [QUERYKEYS.GET_USER, userId],
  });
};

export default useGetUser;
