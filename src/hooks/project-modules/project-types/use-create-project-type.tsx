import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

const useCreateProjectType = () => {
  return useCustomMutation<
    Record<string, string>,
    {
      name: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_PROJECT_TYPE,
  });
};

export default useCreateProjectType;
