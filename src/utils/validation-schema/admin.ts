import * as yup from "yup";
import { z } from "zod";

export const addUserSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required").trim(),
  role: yup.string().required("Role is required").trim(),
});

export const addDocumentTypeSchema = yup.object().shape({
  name: yup.string().required("Type name is required").trim(),
  description: yup.string().required("Access Level is required").trim(),
});

export const addEventTypeSchema = yup.object().shape({
  name: yup.string().required("Type name is required").trim(),
  description: yup.string().required("Description is required").trim(),
});

export const addTaskTypeSchema = yup.object().shape({
  typeName: yup.string().required("Type name is required").trim(),
  description: yup.string().required("Description is required").trim(),
});

export const addProjectPipelineSchema = yup.object().shape({
  name: yup.string().required("Journey name is required").trim(),
  stages: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Name is required").trim(),
      duration: yup
        .number()
        .required("Duration is required")
        .min(1, "Must be more than zero"),
    })
  ),
});

export const addStageSchema = yup.object().shape({
  name: yup.string().required("Stage name is required").trim(),
  duration: yup
    .string()
    .required("Duration is required")
    .min(1, `Duration must be at least 1`)
    .trim(),
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

export const addPlanSchema = yup.object().shape({
  name: yup.string().required("Plan name is required").trim(),
  duration: yup.string().required("Duration is required").trim(),
  price: yup.string().required("Duration is required").trim(),
});

export const editProjectPipelineSchema = yup.object().shape({
  name: yup.string().required("Journey name is required").trim(),
});

export const editJourneyUnifiedSchema = yup.object().shape({
  name: yup.string().required("Journey name is required").trim(),
  milestones: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Name is required").trim(),
        duration: yup
          .number()
          .required("Duration is required")
          .min(1, "Must be at least 1"),
      })
    )
    .min(1, "At least one milestone is required"),
});

