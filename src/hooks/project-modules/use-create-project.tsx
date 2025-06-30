import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { Given } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export interface CreateProjectSchema {
  name: string;
  project_type_id: string;
  start_date: string;
  end_date: string;
  custom_fields?: CustomFields;
}

export interface CustomFields {
  company_name: string;
  legal_structure: string;
  tax_id: string;
  incorporation_date: string;
  articles_file: string[];
}

const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useCustomMutation<Record<string, string>, Record<string, Given>>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_PROJECT,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECTS],
      });
    },
  });
};

export default useCreateProject;
