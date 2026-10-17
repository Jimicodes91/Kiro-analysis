import { TaskDetails } from "@/types/api.types";
import { getTaskDueDate } from "@/utils/task-dates";
import { getDisplayedStatus } from "@/utils/task-display-status";

export type BoardColumnKey = "needs_action" | "in_progress" | "completed";

export interface BoardColumns {
  needs_action: TaskDetails[];
  in_progress: TaskDetails[];
  completed: TaskDetails[];
}

/**
 * Resolve which board column a task belongs to, based on its client-facing
 * displayed status (which already folds in the "Overdue" computation).
 *
 * - "Completed"            -> completed
 * - "In Progress"          -> in_progress
 * - "Pending" | "Overdue"  -> needs_action (both require the client to act)
 */
export function getBoardColumn(task: TaskDetails, now: Date = new Date()): BoardColumnKey {
  const dueDate = getTaskDueDate(task);
  const displayed = getDisplayedStatus(task.status, dueDate, now);

  if (displayed === "Completed") return "completed";
  if (displayed === "In Progress") return "in_progress";
  // "Pending" and "Overdue" both still need the client's action.
  return "needs_action";
}

/**
 * Group tasks into the three board columns. Pure and order-preserving: each
 * column keeps the input order of the tasks it receives, so the caller controls
 * sorting (e.g. newest-first) before grouping.
 */
export function groupTasksByColumn(
  tasks: TaskDetails[],
  now: Date = new Date()
): BoardColumns {
  const columns: BoardColumns = {
    needs_action: [],
    in_progress: [],
    completed: [],
  };

  for (const task of tasks) {
    columns[getBoardColumn(task, now)].push(task);
  }

  return columns;
}
