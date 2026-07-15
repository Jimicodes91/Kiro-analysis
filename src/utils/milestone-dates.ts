import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";

export interface MilestoneDateInfo {
  startDate: Date | null;
  endDate: Date | null;
  isEstimated: boolean; // true for future milestones, false for current/past
}

/**
 * Adds N weekdays to a date, skipping weekends (Sat/Sun).
 * The start day counts as day 1.
 * So addWeekdays(Monday, 1) = Monday (same day).
 * addWeekdays(Monday, 2) = Tuesday.
 * addWeekdays(Friday, 2) = Monday (skips weekend).
 */
export function addWeekdays(startDate: Date, days: number): Date {
  if (days <= 0) return new Date(startDate);

  const result = new Date(startDate);

  // Day 1 is the start date itself, so we need to add (days - 1) more weekdays
  let remaining = days - 1;

  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // Skip Saturday (6) and Sunday (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remaining--;
    }
  }

  return result;
}

/**
 * Gets the next weekday after a given date.
 * If the date is already a weekday, returns the next day (skipping weekends).
 */
export function nextWeekday(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + 1);
  while (result.getDay() === 0 || result.getDay() === 6) {
    result.setDate(result.getDate() + 1);
  }
  return result;
}

/**
 * Calculates start and end dates for all milestones in a project journey.
 *
 * Logic:
 * - Current milestone: uses real milestone_start_date from project
 * - Past milestones: calculated backwards by stacking durations from project start_date
 * - Future milestones: chained forward from current milestone's estimated end date
 *
 * @param milestones - ordered array of milestones from the journey
 * @param currentMilestoneIndex - index of the currently active milestone
 * @param projectStartDate - when the project started (ISO string)
 * @param milestoneStartDate - when the current milestone started (ISO string, from project.milestone_start_date)
 */
export function calculateMilestoneDates(
  milestones: ProjectTypeMilestone[],
  currentMilestoneIndex: number,
  projectStartDate: string | null | undefined,
  milestoneStartDate: string | null | undefined
): MilestoneDateInfo[] {
  if (!milestones || milestones.length === 0) return [];

  const dates: MilestoneDateInfo[] = new Array(milestones.length);

  // If no project start date, we can't calculate anything
  if (!projectStartDate) {
    return milestones.map(() => ({
      startDate: null,
      endDate: null,
      isEstimated: true,
    }));
  }

  // ─── Current milestone (uses real data) ────────────────────────────
  const currentStart = milestoneStartDate
    ? new Date(milestoneStartDate)
    : new Date(projectStartDate);

  const currentDuration = milestones[currentMilestoneIndex]?.duration || 1;
  const currentEnd = addWeekdays(currentStart, currentDuration);

  dates[currentMilestoneIndex] = {
    startDate: currentStart,
    endDate: currentEnd,
    isEstimated: false,
  };

  // ─── Past milestones (estimate by stacking from project start) ─────
  let runningDate = new Date(projectStartDate);

  for (let i = 0; i < currentMilestoneIndex; i++) {
    const duration = milestones[i]?.duration || 1;
    const start = new Date(runningDate);
    const end = addWeekdays(start, duration);

    dates[i] = {
      startDate: start,
      endDate: end,
      isEstimated: true, // approximate for completed milestones
    };

    // Next milestone starts the weekday after this one ends
    runningDate = nextWeekday(end);
  }

  // ─── Future milestones (chain from current milestone's end) ────────
  let futureStart = nextWeekday(currentEnd);

  for (let i = currentMilestoneIndex + 1; i < milestones.length; i++) {
    const duration = milestones[i]?.duration || 1;
    const start = new Date(futureStart);
    const end = addWeekdays(start, duration);

    dates[i] = {
      startDate: start,
      endDate: end,
      isEstimated: true,
    };

    futureStart = nextWeekday(end);
  }

  return dates;
}

/**
 * Formats a date for display on milestone cards.
 * Returns format like "1 Jul" or "1 Jul 2026" if year differs from current.
 */
export function formatMilestoneDate(date: Date | null): string {
  if (!date) return "—";

  const now = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];

  if (date.getFullYear() !== now.getFullYear()) {
    return `${day} ${month} ${date.getFullYear()}`;
  }

  return `${day} ${month}`;
}
