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
export const fileSize = 100 * 1024 * 1024;

export const addProjectTask = z.object({
  name: z.string({
    message: "Task name is required",
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
  file1: fileSchema(fileSize, [
    // CSV files
    "text/csv",
    "application/csv",

    // Excel files
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm
    "application/vnd.ms-excel.template.macroEnabled.12", // .xltm
    "application/vnd.ms-excel.addin.macroEnabled.12", // .xlam
    "application/vnd.ms-excel.sheet.binary.macroEnabled.12", // .xlsb
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template", // .xltx
    "application/vnd.ms-excel.template", // .xlt
    "application/vnd.ms-excel.sheet.macroenabled.12", // Alternate MIME type for .xlsm

    // Additional MIME types for better compatibility
    "application/excel",
    "application/x-excel",
    "application/x-msexcel",
  ]),
});
