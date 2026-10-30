import { cn } from "@/lib/utils";
import { isPast, isToday } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  sent: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  archived: "bg-slate-100 text-slate-500 border-slate-200",
  // Automated visual states
  open_future: "bg-gray-100 text-gray-600 border-gray-200",
  open_today: "bg-green-100 text-green-700 border-green-200",
  open_overdue: "bg-red-100 text-red-700 border-red-200",
  // A task someone has started is still shown as in progress, not as "not started".
  started_on_time: "bg-amber-100 text-amber-700 border-amber-200",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Open",
  sent: "Sent",
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
  open_future: "Not started",
  open_today: "Due Today",
  open_overdue: "Overdue",
  started_on_time: "In Progress",
};

const SIGNING_LABELS: Record<string, string> = {
  sent: "Sent",
  viewed: "Viewed",
  signed: "Signed",
  completed: "Completed",
};

/**
 * Compute the visual status for internal tasks based on due date.
 * - completed/archived → use as-is
 * - otherwise → open_overdue (red), open_today (green), or by progress:
 *   started_on_time ("In Progress", amber) / open_future ("Not started", grey)
 */
function getVisualStatus(status: string, dueDate?: string | null): string {
  if (status === "completed" || status === "archived") return status;
  // Not overdue and not due today: show whether the task has been started.
  const calm = status === "in_progress" ? "started_on_time" : "open_future";
  if (!dueDate) return calm;
  try {
    const due = new Date(dueDate);
    if (isToday(due)) return "open_today";
    if (isPast(due)) return "open_overdue";
    return calm;
  } catch {
    return calm;
  }
}

interface TaskStatusBadgeProps {
  status: string;
  signingStatus?: string;
  dueDate?: string | null;
  className?: string;
}

export function TaskStatusBadge({
  status,
  signingStatus,
  dueDate,
  className,
}: TaskStatusBadgeProps) {
  const visualStatus = dueDate !== undefined ? getVisualStatus(status, dueDate) : status;
  const style = STATUS_STYLES[visualStatus] ?? STATUS_STYLES.draft;
  const label = STATUS_LABELS[visualStatus] ?? status;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
          style
        )}
      >
        {label}
      </span>
      {signingStatus && (
        <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
          {SIGNING_LABELS[signingStatus] ?? signingStatus}
        </span>
      )}
    </div>
  );
}
