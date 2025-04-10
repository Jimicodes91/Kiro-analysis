import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetActiveOrganizations = () => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_ACTIVE_ORGANIZATIONS,
    queryKey: [QUERYKEYS.GET_ACTIVE_ORGANIZATIONS],
  });
};

export default useGetActiveOrganizations;
