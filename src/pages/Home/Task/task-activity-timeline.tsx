import { useTaskActivity } from "@/hooks/project-modules/tasks/use-task-activity";
import { format } from "date-fns";

interface TaskActivityTimelineProps {
  projectId: string;
  taskId: string;
}

const ACTION_LABELS: Record<string, string> = {
  status_changed: "Status changed",
  signing_status_changed: "Signing status changed",
  comment_added: "Comment added",
  comment_deleted: "Comment deleted",
  document_uploaded: "Document uploaded",
  signed_document_stored: "Signed document stored",
  task_archived: "Task archived",
  task_sent: "Task sent",
};

export default function TaskActivityTimeline({
  projectId,
  taskId,
}: TaskActivityTimelineProps) {
  const activity = useTaskActivity(projectId, taskId);

  if (activity.isPending) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 rounded bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (activity.isError) {
    return (
      <p className="text-sm text-gray-400">Failed to load activity</p>
    );
  }

  const entries = activity.value?.data ?? [];

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-400">No activity yet</p>
    );
  }

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity</h3>

      <div className="relative border-l-2 border-gray-200 pl-5 space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="relative">
            {/* Dot */}
            <span className="absolute -left-[1.625rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-gray-300 bg-white" />

            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {ACTION_LABELS[entry.action] ?? entry.action}
              </span>
              {entry.previous_value && entry.new_value && (
                <span className="text-gray-500">
                  {" "}
                  — {entry.previous_value} → {entry.new_value}
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
              <span>{entry.user?.name ?? "System"}</span>
              <span>·</span>
              <span>
                {format(new Date(entry.created_at), "MMM d, yyyy h:mm a")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
