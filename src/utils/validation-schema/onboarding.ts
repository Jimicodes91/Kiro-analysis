import * as yup from "yup";

export const companyDetailsSchema = yup.object().shape({
  name: yup.string().required("Company name is required").trim(),
  industry_type: yup.string().required("Industry type is required").trim(),
  size: yup
    .string()
    .required("Company size is required")
    .oneOf(
      ["startup", "small", "medium", "large", "enterprise"],
      "Company size must be one of: startup, small, medium, large, enterprise"
    )
    .trim(),
  country: yup
    .object()
    .shape({
      id: yup.number().required(),
      name: yup.string().required(),
      iso3: yup.string().required(),
      iso2: yup.string().required(),
      numeric_code: yup.string().required(),
      phone_code: yup.string().required(),
      capital: yup.string().required(),
      currency: yup.string().required(),
      currency_name: yup.string().required(),
      currency_symbol: yup.string().required(),
      tld: yup.string().required(),
      native: yup.string().required(),
      region: yup.string().required(),
      subregion: yup.string().required(),
      latitude: yup.string().required(),
      longitude: yup.string().required(),
      emoji: yup.string().required(),
      hasStates: yup.boolean().required(),
    })
    .typeError("Country is required"),
  state: yup
    .object()
    .shape({
      id: yup.number().required(),
      state_code: yup.string().required(),
      name: yup.string().required(),
      hasCities: yup.boolean().required(),
    })
    .when("country.hasStates", {
      is: true,
      then: (schema) => schema.typeError("State is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  city: yup.string().required("City is required").trim(),
  address: yup.string().required("Company address is required").trim(),
  postal_code: yup.string().required("Postal code is required").trim(),
});

export const inviteTeamSchema = yup.object().shape({
  teamMembers: yup.array().of(
    yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required").trim(),
      role: yup.string().required("Role is required").trim(),
    })
  ),
});
