
import { AddClientProp, AdminSignUpProps, CompanyAdminSignUpProps, CompanyProps, CompleteRegProps, EmailProp, LoginUser, ResetPasswordProps, SendConsultantInviteProps, UpdatePasswordProps } from "../../types";
import axiosInstance from "../../Utils/Https";

const authBaseEndpoint = 'api/v1/auth/';

const apiRequest = async (endpoint: string, payload: object) => {
    try {
      const response = await axiosInstance.post(endpoint, payload);
      return response.data;
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

  export const verifiyEmailApi = (payload: EmailProp) => 
    apiRequest(`${authBaseEndpoint}verify`, payload);         // Passing token but no email

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


  //Onboarding step 1 (company details)
  export const createCompanyApi = (payload: CompanyProps) => 
    apiRequest("/api/v1/company/", payload);