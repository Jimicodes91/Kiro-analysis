import * as yup from "yup";

export const workspaceSignupSchema = yup.object().shape({
  name: yup.string().required("Name is required").trim(),
  email: yup.string().email("Invalid email").required("Email is required").trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .trim(),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match")
    .trim(),
  workspace_name: yup.string().required("Workspace name is required").trim(),
});

export const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required").trim(),
  email: yup.string().email("Invalid email").required("Email is required").trim(),
  password: yup
    .string()
    .required("Password is required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[!@#$%^&*]/, "Password must contain at least one special character")
    .min(8, "Password must be at least 8 characters")
    .trim(),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match")
    .trim(),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New Password is required")
    .matches(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .matches(/\d/, "New Password must contain at least one number")
    .matches(/[!@#$%^&*]/, "New Password must contain at least one special character")
    .min(8, "New Password must be at least 8 characters")
    .trim(),
  confirmNewPassword: yup
    .string()
    .required("Confirm New Password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .trim(),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required").trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters")
    .trim(),
});

export const forgetPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required").trim(),
});

export const completeInviteSchema = yup.object().shape({
  name: yup.string().required("Name is required").trim(),
  newPassword: yup
    .string()
    .required("New Password is required")
    .matches(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .matches(/\d/, "New Password must contain at least one number")
    .matches(/[!@#$%^&*]/, "New Password must contain at least one special character")
    .min(8, "New Password must be at least 8 characters")
    .trim(),
  confirmNewPassword: yup
    .string()
    .required("Confirm New Password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .trim(),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .required("New Password is required")
    .matches(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .matches(/\d/, "New Password must contain at least one number")
    .matches(/[!@#$%^&*]/, "New Password must contain at least one special character")
    .min(8, "New Password must be at least 8 characters")
    .trim(),
  newPassword: yup
    .string()
    .required("New Password is required")
    .matches(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .matches(/\d/, "New Password must contain at least one number")
    .matches(/[!@#$%^&*]/, "New Password must contain at least one special character")
    .min(8, "New Password must be at least 8 characters")
    .trim(),
  confirmNewPassword: yup
    .string()
    .required("Confirm New Password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .trim(),
});

// Multi-step signup wizard schemas
export const credentialsSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required").trim(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/\d/, "Must contain a number")
    .matches(/[!@#$%^&*]/, "Must contain a special character")
    .trim(),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match")
    .trim(),
});

export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .trim(),
});

export const profileCompanySchema = yup.object().shape({
  name: yup.string().required("Full name is required").trim(),
  workspace_name: yup.string().required("Company name is required").trim(),
  industry_type: yup.string().required("Industry type is required").trim(),
  size: yup
    .string()
    .required("Company size is required")
    .oneOf(["startup", "small", "medium", "large", "enterprise"])
    .trim(),
  country: yup.object().typeError("Country is required"),
  address: yup.string().required("Company address is required").trim(),
  city: yup.string().required("City is required").trim(),
});
