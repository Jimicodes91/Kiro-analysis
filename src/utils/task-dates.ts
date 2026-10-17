import { TaskDetails } from "@/types/api.types";

/**
 * Single source of truth for a task's due date.
 *
 * Tasks moved to a `due_date` model, but older records may still only carry
 * `end_date`. Always prefer `due_date` and fall back to `end_date` so every
 * client surface (Home, Tasks board, task view, Journey) shows the same date.
 *
 * Returns undefined when neither is set, so callers can show an explicit
 * "No due date" instead of guessing.
 */
export function getTaskDueDate(
  task?: Pick<TaskDetails, "due_date" | "end_date"> | null
): string | undefined {
  return task?.due_date || task?.end_date || undefined;
}
