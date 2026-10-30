export type DisplayedStatus = "Not started" | "In Progress" | "Completed" | "Overdue";

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
 * Maps a raw task status + due date to the label shown to people looking at
 * tasks (the customer portal and the project task cards).
 *
 * "Not started" is a display label, not a stored status. The API can return a
 * task nobody has started as `pending`, `sent` or `draft`, so everything that is
 * not completed and not in progress counts as "Not started".
 *
 * Precedence:
 * 1. completed → "Completed"
 * 2. overdue   → "Overdue"
 * 3. in_progress → "In Progress"
 * 4. otherwise → "Not started"
 */
export function getDisplayedStatus(
  status: string,
  dueDate?: string | null,
  now: Date = new Date()
): DisplayedStatus {
  if (status === "completed") return "Completed";
  if (isOverdue(status, dueDate, now)) return "Overdue";
  if (status === "in_progress") return "In Progress";
  return "Not started";
}

/**
 * Maps a displayed status to a Badge variant.
 *
 * - Overdue     → red   (destructive)
 * - Not started → grey  (todo)
 * - In Progress → amber (in_progress)
 * - Completed   → green (completed)
 */
export function getDisplayedStatusBadgeVariant(status: DisplayedStatus): string {
  switch (status) {
    case "Completed":
      return "completed";
    case "In Progress":
      return "in_progress";
    case "Overdue":
      return "destructive";
    case "Not started":
    default:
      return "todo";
  }
}
