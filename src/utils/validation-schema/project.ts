import { z } from "zod";

export const fileSchema = (maxSize: number, allowedTypes: string[]) =>
  z
    .any()
    .refine((file) => file instanceof File, {
      message: "Expected a file.",
    })
    .refine((file) => file?.size <= maxSize, {
      // make this 50 mb
      message: `File size should be less than ${maxSize / (100 * 1024 * 1024)}MB.`,
    })
    .refine((file) => allowedTypes.includes(file?.type), {
      message: `Only ${allowedTypes.join(", ")} files are accepted.`,
    });

export const optionalFileSchema = (maxSize: number, allowedTypes: string[]) =>
  z
    .any()
    .refine((file) => file instanceof File, {
      message: "Expected a file.",
    })
    .refine((file) => file?.size <= maxSize, {
      // make this 50 mb
      message: `File size should be less than ${maxSize / (100 * 1024 * 1024)}MB.`,
    })
    .refine((file) => allowedTypes.includes(file?.type), {
      message: `Only ${allowedTypes.join(", ")} files are accepted.`,
    })
    .optional();
export const fileSize = 10 * 1024 * 1024;

export const addProjectTaskSchema = z.object({
  name: z.string({
    message: "Task name is required",
  }),
  task_type_id: z.string({
    message: "Task type is required",
  }),
  status: z.enum(["in_progress", "completed", "pending"], {
    message: "Status is required",
  }),
  description: z.string({
    message: "Description is required",
  }),
  start_date: z.date({
    message: "Start date is required",
  }),
  end_date: z.date({
    message: "End date is required",
  }),
  is_visible_to_client: z.boolean(),
  assignees: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  attachment: fileSchema(fileSize, [
    // CSV files
    "application/pdf",
    "image/png",
    "image/jpeg", // covers both .jpeg and .jpg
    "application/msword",
  ]),
});

export const editProjectTaskSchema = z.object({
  name: z.string({
    message: "Task name is required",
  }),
  task_type_id: z.string({
    message: "Task type is required",
  }),
  status: z.enum(["in_progress", "completed", "pending"], {
    message: "Status is required",
  }),
  description: z.string({
    message: "Description is required",
  }),
  start_date: z.date({
    message: "Start date is required",
  }),
  end_date: z.date({
    message: "End date is required",
  }),
  is_visible_to_client: z.boolean(),
  assignees: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  attachment: optionalFileSchema(fileSize, [
    // CSV files
    "application/pdf",
    "image/png",
    "image/jpeg", // covers both .jpeg and .jpg
    "application/msword",
  ]),
});

export const requestDocumentSchema = z.object({
  name: z.string({
    message: "Document name is required",
  }),
  document_type_id: z.string({
    message: "Document type is required",
  }),
  description: z.string({
    message: "Description is required",
  }),
  end_date: z.date({
    message: "End date is required",
  }),
  is_visible_to_client: z.boolean(),
  assignee_id: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

export const uploadDocumentSchema = z.object({
  file_name: z.string({
    message: "Document name is required",
  }),
  document_type_id: z.string({
    message: "Document type is required",
  }),
  description: z.string({
    message: "Description is required",
  }),
  // is_visible_to_client: z.boolean(),
  attachment: optionalFileSchema(fileSize, [
    // CSV files
    "application/pdf",
    "image/png",
    "image/jpeg", // covers both .jpeg and .jpg
    "application/msword",
  ]),
});

export const addTeamSchema = z.object({
  user_id: z.string({
    message: "Document name is required",
  }),
  is_visible_to_client: z.boolean(),
});

export const addProjectEventSchema = z.object({
  name: z.string({
    message: "Event title is required",
  }),
  venue: z.string({
    message: "Venue is required",
  }),
  event_type_id: z.string({
    message: "Event type is required",
  }),
  description: z.string({
    message: "Description is required",
  }),
  start_date: z.date({
    message: "Date is required",
  }),
  from: z.string({
    message: "Start time is required",
  }),
  to: z.string({
    message: "End time is required",
  }),
  is_visible_to_client: z.boolean(),
});
