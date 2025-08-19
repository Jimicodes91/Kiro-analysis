import * as yup from "yup";

export const companyDetailsSchema = yup.object().shape({
  name: yup.string().required("Company name is required"),
  industry_type: yup.string().required("Industry type is required"),
  size: yup.string().required("Company size is required"),
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
  city: yup
    .object()
    .shape({
      id: yup.number().required("City ID is required"),
      latitude: yup.string().required("City latitude is required"),
      longitude: yup.string().required("City longitude is required"),
      name: yup.string().required("City name is required"),
    })
    .when("state.hasCities", {
      is: true,
      then: (schema) => schema.typeError("City is required"),
      otherwise: (schema) => schema.notRequired(),
    })
    .typeError("City is required"),
  address: yup.string().required("Company address is required"),
  postal_code: yup.string().required("Postal code is required"),
});

export const inviteTeamSchema = yup.object().shape({
  teamMembers: yup.array().of(
    yup.object().shape({
      email: yup.string().email("Invalid email").required("Email is required"),
      role: yup.string().required("Role is required"),
    })
  ),
});
