import { z } from "zod";

/**
 * Regex pattern for validating NativeForms URLs.
 * Matches URLs like:
 * - https://nativeforms.com/abc123
 * - https://app.nativeforms.com/form/xyz
 * - https://subdomain.nativeforms.com/anything
 *
 * Rejects:
 * - http:// (wrong protocol)
 * - https://nativeforms.com (no path after domain)
 * - https://notnativeforms.com/abc (wrong domain)
 * - https://fakednativeforms.com/abc (wrong domain)
 */
const NATIVEFORMS_URL_REGEX = /^https:\/\/(.*\.)?nativeforms\.com\/.+$/;

/**
 * UUID v4 regex pattern for validating optional ID fields.
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates whether a given URL is a valid NativeForms URL.
 *
 * A valid NativeForms URL must:
 * - Use HTTPS protocol
 * - Have nativeforms.com as the domain (with optional subdomain)
 * - Have a non-empty path after the domain
 */
export function isValidNativeFormsUrl(url: string): boolean {
  return NATIVEFORMS_URL_REGEX.test(url);
}

/**
 * Zod schema for validating Form Link creation/update payloads.
 *
 * Validates:
 * - form_url: must be a valid NativeForms URL
 * - display_name: must be non-empty after trimming
 * - project_type_id: optional UUID string
 * - milestone_id: optional UUID string
 * - sort_order: optional non-negative integer
 * - At least one of project_type_id or milestone_id must be provided
 */
export const formLinkSchema = z
  .object({
    form_url: z
      .string()
      .refine((url) => isValidNativeFormsUrl(url), {
        message:
          "URL must be a valid NativeForms URL (https://[subdomain.]nativeforms.com/...)",
      }),
    display_name: z
      .string()
      .trim()
      .min(1, { message: "Display name is required" }),
    project_type_id: z
      .string()
      .regex(UUID_REGEX, { message: "Invalid UUID format" })
      .optional(),
    milestone_id: z
      .string()
      .regex(UUID_REGEX, { message: "Invalid UUID format" })
      .optional(),
    sort_order: z.number().int().min(0).optional(),
  })
  .refine(
    (data) => Boolean(data.project_type_id) || Boolean(data.milestone_id),
    {
      message: "At least one of project type or milestone must be provided",
      path: ["project_type_id"],
    },
  );

/** Inferred type for form link creation/update form data */
export type FormLinkFormData = z.infer<typeof formLinkSchema>;
