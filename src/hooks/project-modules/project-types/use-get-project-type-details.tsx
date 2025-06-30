import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { ProjectType } from "./use-get-all-project-types";

export interface IProjectTypedetailsInterface {
  success: boolean;
  message: string;
  data: ProjectType;
}
const useGetProjectTypeDetails = (projectTypeId: string) => {
  return useQueryActionHook<IProjectTypedetailsInterface>({
    method: "get",
    endpoint: ENDPOINTS.GET_PROJECT_TYPE_DETAILS(projectTypeId),
    queryKey: [QUERYKEYS.GET_PROJECT_TYPE_DETAILS, projectTypeId],
  });
};

export default useGetProjectTypeDetails;
