/**
 * Frontend mirror of the backend TASK_TRANSITION_MAP.
 * Used for UI validation and showing valid next statuses.
 */
export const TASK_TRANSITION_MAP: Record<string, string[]> = {
  draft: ["sent"],
  sent: ["in_progress", "draft"],
  in_progress: ["completed", "sent"],
  completed: ["archived"],
  archived: ["completed"], // unarchive (admin only)
};

/**
 * Returns the list of valid next statuses for a given current status.
 * Returns an empty array if the status is not in the transition map.
 */
export function getValidNextStatuses(currentStatus: string): string[] {
  return TASK_TRANSITION_MAP[currentStatus] ?? [];
}
