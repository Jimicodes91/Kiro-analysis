import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

const useFormTemplates = (search?: string) => {
  const endpoint = search
    ? `${ENDPOINTS.GET_FORM_TEMPLATES}?search=${encodeURIComponent(search)}`
    : ENDPOINTS.GET_FORM_TEMPLATES;

  return useQueryActionHook<any>({
    method: "get",
    endpoint,
    queryKey: [QUERYKEYS.GET_FORM_TEMPLATES, search ?? ""],
  });
};

export default useFormTemplates;
