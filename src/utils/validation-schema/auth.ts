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
