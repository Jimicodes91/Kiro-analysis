import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { FormLinkResponse } from "@/types/nativeforms.types";

const useGetFormLinks = (enabled = true) => {
  return useQueryActionHook<FormLinkResponse[]>({
    method: "get",
    endpoint: ENDPOINTS.GET_NATIVEFORMS_FORM_LINKS,
    queryKey: [QUERYKEYS.GET_NATIVEFORMS_FORM_LINKS],
    enabled,
  });
};

export default useGetFormLinks;
