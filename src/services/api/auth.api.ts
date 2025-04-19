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
  apiRequest(`auth/admin-signup`, payload);

export const signUpCompanyAdminUserApi = (payload: CompanyAdminSignUpProps) =>
  apiRequest(`auth/company-admin-signup`, payload);

export const loginUserApi = (payload: LoginUser) => apiRequest(`auth/login`, payload);

export const verifyEmailApi = (param: TokenProp) =>
  axiosInstance.get(`auth/verify?token=${param.token}`);

export const resendVerificationEmailApi = (payload: EmailProp) =>
  apiRequest(`auth/resend-verification`, payload);

export const forgotPasswordApi = (payload: EmailProp) =>
  apiRequest(`auth/forgot-password`, payload);

export const resetPasswordApi = (payload: ResetPasswordProps) =>
  apiRequest(`auth/reset-password`, payload);

export const updatePasswordApi = (payload: UpdatePasswordProps) =>
  apiRequest(`auth/update-password`, payload);

export const sendConsultantInviteApi = (payload: SendConsultantInviteProps) =>
  apiRequest(`auth/send-invite`, payload);

export const completeRegistrationApi = (payload: CompleteRegProps) =>
  apiRequest(`auth/complete-registration`, payload);

export const addClientApi = (payload: AddClientProp) =>
  apiRequest(`auth/add-client`, payload);

export const createCompanyApi = (payload: CompanyApiProps, userId: string) =>
  apiRequest(`company/create/${userId}`, payload);
