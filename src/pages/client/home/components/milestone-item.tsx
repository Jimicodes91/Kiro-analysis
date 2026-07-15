import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Check, Clock, Dot, Flag } from "lucide-react";

function MilestoneItem({
  title,
  duration,
  status,
  statusText,
  startDate,
  endDate,
}: {
  title: string;
  duration: number;
  status: "in_progress" | "completed" | "blocked";
  statusText: string;
  startDate?: string | null;
  endDate?: string | null;
}) {
  const isCompleted = status === "completed";
  const isCurrent = status === "in_progress";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-3",
        isCompleted
          ? "border-[#00AA3B]/20 bg-[#00AA3B]/[0.03]"
          : isCurrent
            ? "border-[#994C1C]/20 bg-[#994C1C]/[0.03]"
            : "border-gray-200 bg-gray-50/50"
      )}
    >
      {/* Top row */}
      <div className="flex items-center flex-wrap gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center size-7 rounded-full shrink-0",
              isCompleted
                ? "bg-[#00AA3B]"
                : isCurrent
                  ? "border-2 border-[#994C1C] bg-white"
                  : "border-2 border-gray-300 bg-white"
            )}
          >
            {isCompleted ? (
              <Check className="size-3.5 text-white" />
            ) : isCurrent ? (
              <Dot className="size-6 text-[#994C1C]" />
            ) : (
              <span className="size-1.5 rounded-full bg-gray-300" />
            )}
          </div>
          <p className={cn("font-medium text-sm", !isCompleted && !isCurrent && "text-muted-foreground")}>
            {title}
          </p>
        </div>
        <Badge variant={status} size="sm">
          {statusText === "completed"
            ? "Completed"
            : statusText === "in_progress"
              ? "In Progress"
              : "Not Started"}
        </Badge>
      </div>

      {/* Date row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground pl-10">
        {startDate && (
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {isCompleted ? `${startDate} – ${endDate}` : `Started: ${startDate}`}
          </span>
        )}
        {!isCompleted && endDate && (
          <span className="flex items-center gap-1">
            <Flag className="size-3" />
            Est. End: {endDate}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="size-3" />
          {duration} {duration === 1 ? "day" : "days"}
        </span>
      </div>
    </div>
  );
}

export default MilestoneItem;
