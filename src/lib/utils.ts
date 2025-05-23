import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import { ProjectDetails } from "@/types/api.types";
import { clsx, type ClassValue } from "clsx";
import { format, formatISO, isToday, parseISO, startOfDay } from "date-fns";
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

export const today = startOfDay(new Date());

export const getSelectableDate = (date: Date) => startOfDay(date) < today;

export function truncateMiddleWords(text: string, startCount = 8, endCount = 16): string {
  if (!text) return "";
  const words = text.trim().split("");

  if (words.length <= startCount + endCount) {
    console.log(words, "lmao");
    return text; // No need to truncate
  }

  const startWords = words.slice(0, startCount).join("");
  const endWords = words.slice(-endCount).join("");

  return `${startWords}.....${endWords}`;
}

export const getUTCISODateFormat = (localDate: Date) => {
  const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

  const isoUTC = formatISO(utcDate, { representation: "complete" });
  // console.log(isoUTC); // e.g., "2025-05-07T12:34:56Z"
  return isoUTC;
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
