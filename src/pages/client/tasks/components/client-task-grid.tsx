import { TaskDetails } from "@/types/api.types";
import { groupTasksByColumn } from "@/utils/task-board";
import { useMemo } from "react";
import ClientTaskCard from "./client-test-card";

/**
 * Grid view for the customer Tasks page: the same task cards as the board, laid
 * out as one responsive grid instead of three columns.
 *
 * Tasks are ordered by what needs attention first (Needs action, then In
 * progress, then Completed). Within each group the incoming order is kept, so
 * the caller's sort (newest first) still applies.
 */
function ClientTaskGrid({
  tasks,
  projectId,
}: {
  tasks: TaskDetails[];
  projectId: string;
}) {
  const ordered = useMemo(() => {
    const columns = groupTasksByColumn(tasks);
    return [...columns.needs_action, ...columns.in_progress, ...columns.completed];
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
      {ordered.map((task) => (
        <ClientTaskCard key={task.id} task={task} projectId={projectId} />
      ))}
    </div>
  );
}

export default ClientTaskGrid;
