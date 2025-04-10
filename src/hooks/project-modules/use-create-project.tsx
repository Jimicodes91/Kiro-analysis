import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface CreateProjectSchema {
  name: string;
  project_type_id: string;
  start_date: string;
  end_date: string;
  custom_fields: CustomFields;
}

export interface CustomFields {
  company_name: string;
  legal_structure: string;
  tax_id: string;
  incorporation_date: string;
  articles_file: string[];
}

const useCreateProject = () => {
  return useCustomMutation<Record<string, string>, CreateProjectSchema>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_PROJECT,
  });
};

export default useCreateProject;
