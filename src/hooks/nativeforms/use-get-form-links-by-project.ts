import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { FormLinkResponse } from "@/types/nativeforms.types";

const useGetFormLinksByProject = (projectId: string) => {
  return useQueryActionHook<FormLinkResponse[]>({
    method: "get",
    endpoint: ENDPOINTS.GET_NATIVEFORMS_FORM_LINKS_BY_PROJECT(projectId),
    queryKey: [QUERYKEYS.GET_NATIVEFORMS_FORM_LINKS_BY_PROJECT, projectId],
    enabled: Boolean(projectId),
  });
};

export default useGetFormLinksByProject;
