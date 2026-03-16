import * as yup from "yup";

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 3;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
];

export const taskFormSchema = yup.object({
  name: yup
    .string()
    .required("Task name is required")
    .min(3, "Task name must be at least 3 characters")
    .max(255, "Task name must be 255 characters or less"),
  task_type_id: yup.string().optional(),
  project_type_id: yup.string().required("Pipeline is required"),
  project_id: yup.string().required("Project is required"),
  status: yup
    .string()
    .oneOf(["pending", "completed"], "Status must be either pending or completed")
    .required("Status is required"),
  description: yup
    .string()
    .max(5000, "Description must be 5000 characters or less")
    .optional(),
  due_date: yup.date().required("Due date is required"),
  visibility: yup
    .string()
    .oneOf(["inhouse", "client_facing"], "Visibility must be either inhouse or client_facing")
    .required("Visibility is required"),
  document_url: yup
    .string()
    .max(500, "Document URL must be 500 characters or less")
    .optional(),
  is_visible_to_client: yup.boolean().default(false), // Deprecated, use visibility
  assignees: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one assignee is required")
    .required("Assignees are required"),
  attachment: yup
    .array()
    .test("fileSize", "Each file must be less than 5MB", (files) => {
      if (!files || files.length === 0) return true;
      return files.every((file) => file.size <= FILE_SIZE);
    })
    .test("fileType", "Only PDF, PNG, JPG, and DOC files are allowed", (files) => {
      if (!files || files.length === 0) return true;
      return files.every((file) => ALLOWED_FILE_TYPES.includes(file.type));
    })
    .test("maxFiles", `You can upload up to ${MAX_FILES} files`, (files) => {
      if (!files) return true;
      return files.length <= MAX_FILES;
    })
    .optional(),
});
