import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useUpdateProjectTypeDetails = (projectTypeId: string) => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
    }
  >({
    method: "patch",
    endpoint: ENDPOINTS.UPDATE_PROJECT_TYPE_DETAILS(projectTypeId),
  });
};

export default useUpdateProjectTypeDetails;
