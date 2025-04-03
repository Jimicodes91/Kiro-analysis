import * as yup from "yup";

export const addUserSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    role: yup.string().required("Role is required"),
  });