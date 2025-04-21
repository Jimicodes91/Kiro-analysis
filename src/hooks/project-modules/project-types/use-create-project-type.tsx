import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { addProjectPipelineSchema } from "@/utils/validation-schema/admin";
import { useQueryClient } from "@tanstack/react-query";
import { InferType } from "yup";

const useCreateProjectType = () => {
  const queryClient = useQueryClient();

  return useCustomMutation<
    Record<string, string>,
    InferType<typeof addProjectPipelineSchema> & {
      company_id: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.CREATE_PROJECT_TYPE,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECT_TYPES],
      });
    },
  });
};

export default useCreateProjectType;
