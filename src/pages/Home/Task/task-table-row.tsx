import { TableCell, TableRow } from "@/components/ui/table";
import { TaskStatusBadge } from "@/components/ui/task-status-badge";
import { Task } from "@/types/task.types";
import { format } from "date-fns";

const STATUS_ROW_COLORS: Record<string, string> = {
  in_progress: "bg-amber-50",
  completed: "bg-green-50",
  archived: "bg-slate-100",
};

export function getStatusRowColor(status: string): string {
  return STATUS_ROW_COLORS[status] ?? "";
}

function formatDate(value: string | undefined | null): string {
  if (!value) return "—";
  try { return format(new Date(value), "dd MMM, yyyy"); } catch { return "—"; }
}

interface TaskTableRowProps {
  task: Task;
  showCategory?: boolean;
  onTaskClick?: (task: Task) => void;
}

function TaskTableRow({ task, showCategory, onTaskClick }: TaskTableRowProps) {
  const rowColor = getStatusRowColor(task.status);
  const categoryLabel = task.task_category === "external" ? "External" : "Internal";

  return (
    <TableRow
      className={`cursor-pointer ${rowColor}`}
      onClick={() => onTaskClick?.(task)}
    >
      <TableCell>{formatDate(task.created_at)}</TableCell>
      <TableCell>{task.name}</TableCell>
      {showCategory && (
        <TableCell>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              task.task_category === "external"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {categoryLabel}
          </span>
        </TableCell>
      )}
      <TableCell>{formatDate(task.due_date ?? task.end_date)}</TableCell>
      <TableCell>{task.pipeline?.name ?? "—"}</TableCell>
      <TableCell>{task.project?.name ?? "—"}</TableCell>
      <TableCell>
        <TaskStatusBadge
          status={task.status}
          signingStatus={task.task_category_type === "signing" ? task.signing_status : undefined}
        />
      </TableCell>
    </TableRow>
  );
}

export default TaskTableRow;
