export type DisplayedStatus = "Pending" | "In Progress" | "Completed" | "Overdue";

/**
 * A task is overdue when:
 * - a due date exists, AND
 * - the current date is strictly past the due date, AND
 * - the status is not "completed".
 *
 * In all other cases (no due date, on/before due date, or completed) → false.
 */
export function isOverdue(
  status: string,
  dueDate?: string | null,
  now: Date = new Date()
): boolean {
  if (!dueDate) return false;
  if (status === "completed") return false;

  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return false;

  // Compare at day granularity — overdue only once the due day has fully passed
  const nowDay = new Date(now);
  nowDay.setHours(0, 0, 0, 0);
  const dueDay = new Date(due);
  dueDay.setHours(0, 0, 0, 0);

  return nowDay.getTime() > dueDay.getTime();
}

/**
 * Maps a raw task status + due date to a client-facing displayed status.
 *
 * Precedence:
 * 1. completed → "Completed"
 * 2. overdue   → "Overdue"
 * 3. in_progress → "In Progress"
 * 4. otherwise → "Pending"
 */
export function getDisplayedStatus(
  status: string,
  dueDate?: string | null,
  now: Date = new Date()
): DisplayedStatus {
  if (status === "completed") return "Completed";
  if (isOverdue(status, dueDate, now)) return "Overdue";
  if (status === "in_progress") return "In Progress";
  return "Pending";
}

/**
 * Maps a displayed status to an existing Badge component variant.
 */
export function getDisplayedStatusBadgeVariant(status: DisplayedStatus): string {
  switch (status) {
    case "Completed":
      return "completed";
    case "In Progress":
      return "in_progress";
    case "Overdue":
      return "late"; // red
    case "Pending":
    default:
      return "pending";
  }
}
