import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { getUserSession } from "@/services/api.service";

export interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: UserDetails;
}

export interface UserDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  email: string;
  pfp: string;
  password: string;
  name: string;
  phone_number: string;
  otp: string;
  otp_expires: string;
  role: string;
  company_id: string;
  is_blocked: number;
  is_verified: number;
  timezone: string;
  language: string;
  currency: string;
  is_active: number;
  last_login: string;
  verification_token: string;
  token_expires: string;
  googleId: string;
  refresh_token: string;
  refresh_token_expires: string;
  password_setup_token: string;
  login_count: number;
  password_setup_token_expires: string;
  company: Company;
}

export interface Company {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  name: string;
  industry_type: string;
  size: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
  admin_id: string;
  consultant_id: string;
  client_id: string;
  is_active: number;
  subscription_status: string;
  subscription_expiry_date: string;
  project_id: string;
  client_users: string;
  consultant_users: string;
  subscription_id: string;
}

const useGetUser = () => {
  const user = getUserSession();
  const userData = user?.id ?? "";
  return useQueryActionHook<UserDetailsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_USER(userData),
    queryKey: [QUERYKEYS.GET_USER, userData],
  });
};

export default useGetUser;
