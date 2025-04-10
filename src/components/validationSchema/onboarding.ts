import * as yup from "yup";

export const companyDetailsSchema = yup.object().shape({
  name: yup.string().required("Company name is required"),
  industryType: yup.string().required("Industry type is required"),
  size: yup.string().required("Company size is required"),
  country: yup.string().required("Country is required"),
  address: yup.string().required("Company address is required"),
  city: yup.string().required("City is required"),
  postalCode: yup.string().required("Postal code is required"),
});

export const inviteTeamSchema = yup.object().shape({
  teamMembers: yup.array().of(
    yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),
      role: yup.string().required("Role is required"),
    })
  ),
});
