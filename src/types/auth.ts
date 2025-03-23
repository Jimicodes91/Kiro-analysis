export interface AdminSignUpProps {
email: string
password: string
}
export interface AdminSignUpFormProps extends AdminSignUpProps {
  confirmPassword: string
}
export interface CompanyAdminSignUpProps extends AdminSignUpProps {
name: string
}

export interface LoginUser {
email: string
password: string
}
export interface CompleteRegProps {
email: string
password: string
companyId: string
}
export interface SendConsultantInviteProps {
email: string
role: string
}
export interface UpdatePasswordProps {
newPassword: string
currentPassword: string
}
export interface ResetPasswordProps {
token: string
newPassword: string
}
export interface TokenProp {
token: string
}
export interface EmailProp {
email: string
}
export interface AddClientProp {
name: string
email: string
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
