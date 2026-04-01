import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useFormVersions = (templateId: string, enabled = true) => {
  return useQueryActionHook<any>({
    method: "get",
    endpoint: ENDPOINTS.GET_FORM_VERSIONS(templateId),
    queryKey: [QUERYKEYS.GET_FORM_VERSIONS, templateId],
    enabled: Boolean(templateId) && enabled,
  });
};

export default useFormVersions;
