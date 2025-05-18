import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

export interface IFormFields {
  success: boolean;
  message: string;
  data: IFormField[];
}

export interface IFormField {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  form_id: string;
  company_id: string;
  name: string;
  type: string;
  is_required: number;
  is_custom: number;
  is_multiple: 1 | 0;
  max_files?: string;
  accepted_types?: string;
  options?: string[];
  default_value?: string;
  sort_order: number;
  slug: string;
  api_locator: "journey-list" | "contact-list";
}

const useGetProjectFormFields = () => {
  return useQueryActionHook<IFormFields>({
    method: "get",
    endpoint: ENDPOINTS.GET_PROJECT_FORM_FIELDS,
    queryKey: [QUERYKEYS.GET_PROJECT_FORM_FIELDS],
  });
};

export default useGetProjectFormFields;
