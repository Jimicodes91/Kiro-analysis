import axiosInstance from "@/utils/Https";
import {
  AddClientProp,
  AdminSignUpProps,
  CompanyAdminSignUpProps,
  CompanyApiProps,
  CompleteRegProps,
  EmailProp,
  LoginUser,
  ResetPasswordProps,
  SendConsultantInviteProps,
  TokenProp,
  UpdatePasswordProps,
} from "../../types";

const authBaseEndpoint = "/api/v1/auth/";

const apiRequest = async (endpoint: string, payload: object) => {
  try {
    const response = await axiosInstance.post(endpoint, payload);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const signUpAdminUserApi = (payload: AdminSignUpProps) =>
  apiRequest(`${authBaseEndpoint}admin-signup`, payload);

export const signUpCompanyAdminUserApi = (payload: CompanyAdminSignUpProps) =>
  apiRequest(`${authBaseEndpoint}company-admin-signup`, payload);

export const loginUserApi = (payload: LoginUser) =>
  apiRequest(`${authBaseEndpoint}login`, payload);

export const verifyEmailApi = (param: TokenProp) =>
  axiosInstance.get(`${authBaseEndpoint}verify?token=${param.token}`);

export const resendVerificationEmailApi = (payload: EmailProp) =>
  apiRequest(`${authBaseEndpoint}resend-verification`, payload);

export const forgotPasswordApi = (payload: EmailProp) =>
  apiRequest(`${authBaseEndpoint}forgot-password`, payload);

export const resetPasswordApi = (payload: ResetPasswordProps) =>
  apiRequest(`${authBaseEndpoint}reset-password`, payload);

export const updatePasswordApi = (payload: UpdatePasswordProps) =>
  apiRequest(`${authBaseEndpoint}update-password`, payload);

export const sendConsultantInviteApi = (payload: SendConsultantInviteProps) =>
  apiRequest(`${authBaseEndpoint}send-consultant-invite`, payload);

export const completeRegistrationApi = (payload: CompleteRegProps) =>
  apiRequest(`${authBaseEndpoint}complete-registration`, payload);

export const addClientApi = (payload: AddClientProp) =>
  apiRequest(`${authBaseEndpoint}add-client`, payload);

export const createCompanyApi = (payload: CompanyApiProps) =>
  apiRequest("/api/v1/company/create", payload);
