import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

export interface ICompanyDetails {
  success: boolean;
  message: string;
  data: CompanyDetails;
}

export interface CompanyDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  name: string;
  industry_type: string;
  size: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
  admin_id: string;
  consultant_id?: string;
  client_id?: string;
  is_active: number;
  subscription_status: string;
  subscription_expiry_date?: string;
  project_id?: string;
  client_users?: string;
  consultant_users?: string;
}

const useGetCompanyDetails = (companyId: string) => {
  return useQueryActionHook<ICompanyDetails>({
    method: "get",
    endpoint: ENDPOINTS.GET_COMPANY_DETAILS(companyId),
    queryKey: [QUERYKEYS.GET_COMPANY_DETAILS, companyId],
  });
};

export default useGetCompanyDetails;
