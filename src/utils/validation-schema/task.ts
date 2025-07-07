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
    .min(3, "Task name must be at least 3 characters"),
  task_type_id: yup.string().required("Task type is required"),
  project_type_id: yup.string().required("Pipeline is required"),
  project_id: yup.string().required("Project is required"),
  status: yup
    .string()
    // .oneOf(["in_progress", "pending", "completed"], "Invalid status")
    .required("Status is required"),
  description: yup.string().required("Description is required"),
  start_date: yup.date().required("Start date is required"),
  end_date: yup.date().required("End date is required"),
  is_visible_to_client: yup.boolean().default(false),
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
    .required("Attachment is required"),
});
