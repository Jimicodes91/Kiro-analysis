import * as yup from "yup";
import { z } from "zod";

export const addUserSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role is required"),
});

export const addDocumentTypeSchema = yup.object().shape({
  name: yup.string().required("Type name is required"),
  description: yup.string().required("Access Level is required"),
});

export const addEventTypeSchema = yup.object().shape({
  name: yup.string().required("Type name is required"),
  description: yup.string().required("Description is required"),
});

export const addTaskTypeSchema = yup.object().shape({
  typeName: yup.string().required("Type name is required"),
  description: yup.string().required("Description is required"),
});

export const addProjectPipelineSchema = yup.object().shape({
  name: yup.string().required("Journey name is required"),
  stages: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Name is required"),
      duration: yup
        .number()
        .required("Duration is required")
        .min(1, "Must be more than zero"),
    })
  ),
});

export const addStageSchema = yup.object().shape({
  name: yup.string().required("Stage name is required"),
  duration: yup
    .string()
    .required("Duration is required")
    .min(1, `Duration must be at least 1`),
});

export const addCompanySubscriptionSchema = z.object({
  start_date: z.date({
    message: "Start date is required",
  }),
  end_date: z.date({
    message: "End date is required",
  }),
  plan_id: z
    .string({
      required_error: "Plan is required",
    })
    .min(1, "Plan is required"),
  seats: z.string({
    required_error: "Seats is required",
  }),
});
