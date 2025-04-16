import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function getInitials(name?: string) {
  if (!name) return "";
  if (name.split(" ").length === 1) return name.substring(0, 2).toUpperCase();
  return name
    .split(" ")
    .splice(0, 2)
    .map((item) => item.substring(0, 1))
    .join("")
    .toUpperCase();
}

/**
 * Checks each property in the given object. If the value is a Date or a string that represents a valid date,
 * it converts it to an ISO string.
 *
 * @param obj - The input object with dynamic fields.
 * @returns A new object with date values converted to strings.
 */

export type Given = number | string | Date;
export function convertDatesToYMD(obj: Record<string, Given>): Record<string, Given> {
  const result: Record<string, Given> = {};
  for (const key in obj) {
    const value = obj[key];
    // Check if the value is a string.
    if (key.toLowerCase().includes("date") && typeof value !== "string") {
      const parsedDate = new Date(value);
      // If the date is valid, format it as YYYY-MM-DD.
      if (!isNaN(parsedDate.getTime())) {
        // Using toISOString splits at the T, yielding the date part.
        result[key] = format(parsedDate, "yyy-MM-dd");
        continue;
      }
    }

    if (key === "project_value") {
      // If the value is a number, convert it to a number.
      result[key] = +value;
      continue;
    }
    // Otherwise, copy the value as is.
    result[key] = value;
  }

  return result;
}
