import { TaskDetails } from "@/types/api.types";
import { BoardColumnKey, groupTasksByColumn } from "@/utils/task-board";
import { useMemo } from "react";
import ClientTaskCard from "./client-test-card";

const COLUMNS: {
  key: BoardColumnKey;
  label: string;
  dotClass: string;
  emptyText: string;
}[] = [
  {
    key: "needs_action",
    label: "Needs action",
    dotClass: "bg-primary",
    emptyText: "Nothing needs your action right now.",
  },
  {
    key: "in_progress",
    label: "In progress",
    dotClass: "bg-[#B78026]",
    emptyText: "No tasks in progress.",
  },
  {
    key: "completed",
    label: "Completed",
    dotClass: "bg-[#00AA3B]",
    emptyText: "No completed tasks yet.",
  },
];

/**
 * Client Tasks board (ClickUp-style): tasks grouped into three status columns
 * so the client can scan what needs attention without a long scroll. Each card
 * remains clickable through to the task action (handled by ClientTaskCard).
 */
function ClientTaskBoard({
  tasks,
  projectId,
}: {
  tasks: TaskDetails[];
  projectId: string;
}) {
  const columns = useMemo(() => groupTasksByColumn(tasks), [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      {COLUMNS.map((col) => {
        const colTasks = columns[col.key];
        return (
          <div
            key={col.key}
            className="rounded-xl border border-brand-border bg-[#F8F8F8] p-3 flex flex-col"
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-1 pb-3">
              <div className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${col.dotClass}`} />
                <h3 className="text-sm font-semibold text-primary">{col.label}</h3>
              </div>
              <span className="text-xs font-medium text-brand-fade bg-white rounded-full px-2 py-0.5 border border-brand-border">
                {colTasks.length}
              </span>
            </div>

            {/* Column body */}
            <div className="space-y-3">
              {colTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed border-brand-border bg-white/60 py-8 px-3 text-center">
                  <p className="text-xs text-brand-fade">{col.emptyText}</p>
                </div>
              ) : (
                colTasks.map((task) => (
                  <ClientTaskCard key={task.id} task={task} projectId={projectId} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ClientTaskBoard;
