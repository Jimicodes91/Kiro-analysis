import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  sent: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  archived: "bg-slate-100 text-slate-500 border-slate-200",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
};

const SIGNING_LABELS: Record<string, string> = {
  sent: "Sent",
  viewed: "Viewed",
  signed: "Signed",
  completed: "Completed",
};

interface TaskStatusBadgeProps {
  status: string;
  signingStatus?: string;
  className?: string;
}

export function TaskStatusBadge({
  status,
  signingStatus,
  className,
}: TaskStatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  const label = STATUS_LABELS[status] ?? status;

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
