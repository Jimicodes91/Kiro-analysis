import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import { ProjectDetails, Trail } from "@/types/api.types";
import { clsx, type ClassValue } from "clsx";
import { addDays, format, formatISO, isToday, parseISO, startOfDay } from "date-fns";
import { twMerge } from "tailwind-merge";

export const formatDate = (isoDate: string): string => {
  const date = parseISO(isoDate);

  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }

  return format(date, "PPp"); // fallback format like "Apr 29, 2025 at 9:47 PM"
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Computes the visual project status based on dates.
 * - "completed" stays as "completed"
 * - Past end_date + not completed → "late"
 * - End_date within 7 days + not completed → "due"
 * - Otherwise → use stored status
 */
export function getComputedProjectStatus(
  storedStatus: string,
  endDate?: string | null
): string {
  if (!endDate) return storedStatus;
  if (storedStatus === "completed") return "completed";

  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const daysUntilDue = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return "late";
    if (daysUntilDue <= 7) return "due";
    return storedStatus;
  } catch {
    return storedStatus;
  }
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

export type Given = number | string | Date | { label: string; value: string }[];
export function convertDatesToYMD(obj: Record<string, Given>): Record<string, Given> {
  const result: Record<string, Given> = {};
  for (const key in obj) {
    const value = obj[key];
    // Check if the value is a string.
    if (key.toLowerCase().includes("date") && !Array.isArray(value)) {
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

    if (key === "nationality" || key === "resident_country") {
      // If the value is a number, convert it to a number.
      // @ts-expect-error dddgh
      result[key] = +value?.name;
      continue;
    }

    if (Array.isArray(value)) {
      const idList = value?.map((item) => item.value);
      // @ts-expect-error dddd
      result[key] = idList;
      continue;
    }
    // Otherwise, copy the value as is.
    result[key] = value;
  }

  return result;
}

export function getFormattedText(name?: string) {
  if (!name) return "";
  return name.split("_").join(" ");
}

export const generateBoardMilestone = (
  projectTypes: ProjectType[] | undefined,
  activeProjectType: string
) => {
  if (!projectTypes) return [];
  const milestones = projectTypes?.find(
    (item) => item.id === activeProjectType
  )?.milestones;

  if (milestones) {
    return milestones;
  } else {
    return [];
  }
};

export const getMileStoneProject = (projects: ProjectDetails[], milestoneId: string) => {
  const filteredProjects = projects.filter((item) =>
    milestoneId === "disabled" ? !item.milestone_id : item.milestone_id === milestoneId
  );
  return filteredProjects;
};

export function updateProjectMilestoneById(
  projects: ProjectDetails[],
  projectId: string,
  milestoneId: string
): ProjectDetails[] {
  return projects.map((project) =>
    project.id === projectId ? { ...project, milestone_id: milestoneId } : project
  );
}

export function updateProjectsIndex(
  projects: ProjectDetails[],
  projectId: string,
  newIndex: number
) {
  // Step 1: Find the project to move
  const movingProject = projects.find((p) => p.id === projectId);
  if (!movingProject) {
    return projects; // if project not found, return original
  }

  // Step 2: Remove the moving project from the array
  const remainingProjects = projects.filter((p) => p.id !== projectId);

  // Step 3: Insert the moving project at the desired index
  const updatedProjects = [
    ...remainingProjects.slice(0, newIndex),
    movingProject,
    ...remainingProjects.slice(newIndex),
  ];

  // Step 4: Update the `index` field properly
  return updatedProjects.map((p, idx) => ({
    ...p,
    index: idx,
  }));
}

export function convertToKilobyte(size: number) {
  const newSize = size / 1024;

  return newSize.toFixed(2);
}

// export const getCurrentMilestone = (milestones, milestoneId: string)

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file); // Converts to base64 string (data URL format)
  });
}

export const today = startOfDay(new Date("2015-01-01"));

export const getSelectableDate = (date: Date) => startOfDay(date) < today;

export function truncateMiddleWords(text: string, startCount = 8, endCount = 16): string {
  if (!text) return "";
  const words = text.trim().split("");

  if (words.length <= startCount + endCount) {
    return text; // No need to truncate
  }

  const startWords = words.slice(0, startCount).join("");
  const endWords = words.slice(-endCount).join("");

  return `${startWords}.....${endWords}`;
}

export const getUTCISODateFormat = (localDate?: Date | string | null) => {
  if (!localDate) return undefined;

  const date = localDate instanceof Date ? localDate : new Date(localDate);

  // Guard against invalid dates (e.g. undefined/empty after a reload) so
  // formatISO does not throw "Invalid time value".
  if (isNaN(date.getTime())) return undefined;

  const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return formatISO(utcDate, { representation: "complete" });
};

/**
 * Safely format a date value for display. Returns `fallback` when the value is
 * missing or invalid instead of throwing date-fns "Invalid time value".
 */
export const safeFormatDate = (
  value: Date | string | number | null | undefined,
  pattern: string = "PPP",
  fallback: string = ""
): string => {
  if (value === null || value === undefined || value === "") return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return fallback;
  return format(date, pattern);
};

export const createTimeDateFormat = (date: Date, time: string) => {
  const [hour, minute] = time.split(":");
  const newDate = date;
  newDate.setHours(+hour, +minute, 0, 0);

  return getUTCISODateFormat(newDate);
};

export const stringfyList = (words: string[]) => {
  if (!words) return "";

  return words.map((i) => truncateMiddleWords(i)).join(" ,");
};

export const formatCurrency = (amount: string | number) => {
  if (!amount) return "";
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

type TimeGroup = "Today" | "Last 7 days" | "2 weeks ago" | string;

export const groupEntriesByTimePeriod = (
  entries: Trail[]
): Record<TimeGroup, Trail[]> => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);

  return entries.reduce((groups: Record<TimeGroup, Trail[]>, entry) => {
    let group: TimeGroup;
    const entryDate = new Date(entry.created_at);

    if (entryDate >= today) {
      group = "Today";
    } else if (entryDate >= oneWeekAgo) {
      group = "Last 7 days";
    } else if (entryDate >= twoWeeksAgo) {
      group = "2 weeks ago";
    } else {
      group = "Older";
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(entry);
    return groups;
  }, {});
};

export const addDaysUtil = (rawDate = "", days = 0) => {
  // Add 5 days
  const newDate = addDays(new Date(rawDate ?? ""), days ?? 0);

  // Format result
  const formatted = format(newDate, "MMM d, yyyy");

  return formatted;
};
