import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useGetProjectForms = () => {
  return useQueryActionHook({
    method: "get",
    endpoint: ENDPOINTS.GET_PROJECT_FORMS,
    queryKey: [QUERYKEYS.GET_PROJECT_FORMS],
  });
};

export default useGetProjectForms;
