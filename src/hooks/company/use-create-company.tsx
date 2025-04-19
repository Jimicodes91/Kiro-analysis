import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";
import { CompanyDetails } from "@/types";

export interface CreateCompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}

export interface Company {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  industry_type: string;
  size: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
  admin_id: string;
  is_active: boolean;
}

const useCreateCompany = (userId: string) => {
  return useCustomMutation<CreateCompanyResponse, CompanyDetails>({
    method: "post",
    endpoint: ENDPOINTS.CREATE_COMPANY(userId),
  });
};

export default useCreateCompany;
