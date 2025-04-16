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
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
  email: string;
  pfp: unknown;
  name: string;
  role: string;
  company_id: unknown;
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

export interface AuthData {
  token: string;
  user: User;
}
