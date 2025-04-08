import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetAllProjectTypes = () => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_ALL_PROJECT_TYPES,
    queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPES],
  });
};

export default useGetAllProjectTypes;
