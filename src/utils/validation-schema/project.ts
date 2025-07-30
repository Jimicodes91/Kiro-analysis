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

export const fileListSchema = (
  maxSize: number,
  allowedTypes: string[],
  maxFiles: number
) =>
  z
    .any()
    .refine(
      (files) => {
        if (typeof files === "undefined" || files.length === 0) {
          return false;
        }
        return true;
      },
      {
        message: "At least one file is required.",
      }
    )
    .refine(
      (files) => {
        if (Array.isArray(files)) {
          return files.length <= maxFiles;
        }
        return false;
      },
      {
        message: `You can upload up to ${maxFiles} files.`,
      }
    )
    .refine(
      (files) => {
        if (typeof files === "undefined" || files.length === 0) {
          return false;
        }
        return Array.from(files as FileList).every((file) => file.size <= maxSize);
      },
      {
        message: `Each file must be less than ${maxSize / (1024 * 1024)}MB.`,
      }
    )
    .refine(
      (files) => {
        if (typeof files === "undefined" || files.length === 0) {
          return false;
        }
        return Array.from(files as FileList).every((file) =>
          allowedTypes.includes(file.type)
        );
      },
      {
        message: `Only the following types are allowed: ${allowedTypes.join(", ")}`,
      }
    );

export const fileSize = 5 * 1024 * 1024; // 5MB
export const maxFiles = 3;

export const addProjectTaskSchema = z.object({
  name: z
    .string({
      message: "Task name is required",
    })
    .min(3, {
      message: "Task name is too short",
    }),
  task_type_id: z
    .string({
      message: "Task type is required",
    })
    .optional(),
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
  is_visible_to_client: z.boolean().default(false),
  assignees: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  attachment: fileListSchema(
    fileSize,
    [
      // CSV files
      "application/pdf",
      "image/png",
      "image/jpeg", // covers both .jpeg and .jpg
      "application/msword",
    ],
    maxFiles
  ).optional(),
});

export const editProjectTaskSchema = z.object({
  name: z.string({
    message: "Task name is required",
  }),
  task_type_id: z
    .string({
      message: "Task type is required",
    })
    .optional(),
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
  is_visible_to_client: z.boolean().default(false),
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
  document_type_id: z
    .string({
      message: "Document type is required",
    })
    .optional(),
  description: z.string({
    message: "Description is required",
  }),
  end_date: z.date({
    message: "End date is required",
  }),
  is_visible_to_client: z.boolean().default(false),
  assignee_id: z.object({
    label: z.string(),
    value: z.string(),
  }),
});

export const uploadDocumentSchema = z.object({
  file_name: z.string({
    message: "Document name is required",
  }),
  document_type_id: z
    .string({
      message: "Document type is required",
    })
    .optional(),
  description: z.string({
    message: "Description is required",
  }),
  // is_visible_to_client: z.boolean().default(false),
  attachment: fileListSchema(
    fileSize,
    [
      // CSV files
      "application/pdf",
      "image/png",
      "image/jpeg", // covers both .jpeg and .jpg
      "application/msword",
    ],
    maxFiles
  ),
});

export const addTeamSchema = z.object({
  user_id: z.string({
    message: "Document name is required",
  }),
});

export const addProjectEventSchema = z.object({
  name: z.string({
    message: "Event title is required",
  }),
  venue: z.string({
    message: "Venue is required",
  }),
  event_type_id: z
    .string({
      message: "Event type is required",
    })
    .optional(),
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
  is_visible_to_client: z.boolean().default(false),
});

export const addNoteCommentSchema = z.object({
  content: z.string({
    message: "Please enter a comment",
  }),
});
