import useCustomMutation from "@/hooks/use-mutationaction";
import { ENDPOINTS } from "@/lib/constants";

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
  email: string;
  pfp: unknown;
  name: string;
  role: "ADMIN";
  company_id: string;
  company_name: string;
  is_blocked: number;
  is_verified: number;
  timezone: unknown;
  language: string;
  currency: string;
  is_active: number;
  last_login: unknown;
  verification_token: string;
  token_expires: number;
  googleId: unknown;
  refresh_token: unknown;
  refresh_token_expires: unknown;
  password_setup_token: unknown;
  login_count: number;
  password_setup_token_expires: unknown;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

const useAuthLogin = () => {
  return useCustomMutation<
    LoginResponse,
    {
      email: string;
      password: string;
    }
  >({
    method: "post",
    endpoint: ENDPOINTS.AUTH_LOGIN,
  });
};

export default useAuthLogin;
