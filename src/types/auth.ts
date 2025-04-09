export interface AdminSignUpProps {
  name: string;
  email: string;
  password: string;
}
export interface AdminSignUpFormProps extends AdminSignUpProps {
  confirmPassword: string;
}
export interface CompanyAdminSignUpProps extends AdminSignUpProps {
  name: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
export interface CompleteRegProps {
  email: string;
  password: string;
  companyId: string;
}
export interface SendConsultantInviteProps {
  email: string;
  role: string;
}
export interface UpdatePasswordProps {
  newPassword: string;
  currentPassword: string;
}
export interface ResetPasswordProps {
  token: string;
  newPassword: string;
}

export interface ResetPasswordFormProps {
  newPassword: string;
  confirmNewPassword: string;
}
export interface TokenProp {
  token: string;
}
export interface EmailProp {
  email: string;
}
export interface AddClientProp {
  name: string;
  email: string;
}

export interface CompanyProps {
  name: string;
  industryType: string;
  size: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
}
export interface CompanyApiProps {
  name: string;
  industry_type: string;
  size: string;
  country: string;
  address: string;
  city: string;
  postal_code: string;
}

export interface User {
  id: string;
  email: string;
  pfp: string | null;
  name: string | null;
}

export interface AuthData {
  token: string;
  user: User;
  company_id: string | null;
  created_at: string;
  currency: string;
  deleted_at: string | null;
  is_active: number;
  is_blocked: number;
  is_verified: number;
  language: string;
  last_login: string;
  login_count: number;
  password_setup_token: string | null;
  password_setup_token_expires: string | null;
  refresh_token: string | null;
  refresh_token_expires: string | null;
  role: "ADMIN" | "USER" | "OTHER_ROLE";
  timezone: string | null;
  token_expires: string | null;
  updated_at: string;
  verification_token: string | null;
}
