import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetAllAdmins = () => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_ADMINS,
    queryKey: [QUERYKEYS.GET_ALL_ADMINS],
  });
};

export default useGetAllAdmins;
