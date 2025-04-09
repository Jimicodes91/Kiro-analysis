import * as yup from "yup";

export const signupSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
    .string()
    .required("Password is required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character",
    )
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  });

export const resetPasswordSchema = yup.object().shape({
    newPassword: yup
    .string()
    .required("New Password is required")
    .matches(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .matches(/\d/, "New Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "New Password must contain at least one special character",
    )
    .min(8, "New Password must be at least 8 characters"),
  confirmNewPassword: yup
    .string()
    .required("Confirm New Password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });

export const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
    .string()
    .required("Password is required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character",
    )
    .min(8, "Password must be at least 8 characters"),
  });

export const forgetPasswordSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
  });