import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useFormPrefill = (templateId: string, clientId: string, enabled = true) => {
  return useQueryActionHook<any>({
    method: "get",
    endpoint: ENDPOINTS.GET_FORM_PREFILL(templateId, clientId),
    queryKey: [QUERYKEYS.GET_FORM_PREFILL, templateId, clientId],
    enabled: Boolean(templateId) && Boolean(clientId) && enabled,
  });
};

export default useFormPrefill;
