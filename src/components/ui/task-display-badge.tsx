import { Badge } from "@/components/ui/badge";
import {
  getDisplayedStatus,
  getDisplayedStatusBadgeVariant,
} from "@/utils/task-display-status";

/**
 * The one place a task's status is shown as a coloured label, so every screen
 * agrees: Overdue is red, Not started is grey, In Progress is amber and
 * Completed is green.
 *
 * Pass the task's real due date so Overdue can be worked out.
 */
export function TaskDisplayBadge({
  status,
  dueDate,
  size,
  className,
}: {
  status: string;
  dueDate?: string | null;
  size?: "sm" | "md";
  className?: string;
}) {
  const displayed = getDisplayedStatus(status, dueDate);
  return (
    <Badge
      variant={getDisplayedStatusBadgeVariant(displayed) as any}
      size={size}
      className={className}
    >
      {displayed}
    </Badge>
  );
}
