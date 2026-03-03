import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

type CompanyDetails = {
  name: string;
  industry_type: string;
  size: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postal_code: string;
};

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

const useUpdateCompanyDetails = (companyId: string) => {
  return useCustomMutation<Record<string, unknown>, Partial<CompanyDetails>>({
    method: "put",
    endpoint: ENDPOINTS.UPDATE_COMPANY(companyId),
  });
};

export default useUpdateCompanyDetails;
