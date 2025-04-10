import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetInactiveOrganizations = () => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_INACTIVE_ORGANIZATIONS,
    queryKey: [QUERYKEYS.GET_INACTIVE_ORGANIZATIONS],
  });
};

export default useGetInactiveOrganizations;
