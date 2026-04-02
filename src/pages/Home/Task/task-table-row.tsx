import { TableCell, TableRow } from "@/components/ui/table";
import { TaskStatusBadge } from "@/components/ui/task-status-badge";
import { Task } from "@/types/task.types";

const STATUS_ROW_COLORS: Record<string, string> = {
  in_progress: "bg-amber-50",
  completed: "bg-green-50",
  archived: "bg-slate-100",
};

export function getStatusRowColor(status: string): string {
  return STATUS_ROW_COLORS[status] ?? "";
}

interface TaskTableRowProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
}

function TaskTableRow({ task, onTaskClick }: TaskTableRowProps) {
  const rowColor = getStatusRowColor(task.status);

  return (
    <TableRow
      className={`cursor-pointer ${rowColor}`}
      onClick={() => onTaskClick?.(task)}
    >
      <TableCell>{task.created_at}</TableCell>
      <TableCell>{task.name}</TableCell>
      <TableCell>{task.end_date}</TableCell>
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
