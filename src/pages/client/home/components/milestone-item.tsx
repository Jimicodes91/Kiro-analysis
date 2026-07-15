import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Check, Dot, Flag } from "lucide-react";

function MilestoneItem({
  title,
  status,
  statusText,
  startDate,
  endDate,
}: {
  title: string;
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
        "flex items-center flex-wrap gap-3 justify-between rounded-lg border p-3",
        isCompleted
          ? "border-[#00AA3B]/20 bg-[#00AA3B]/[0.03]"
          : isCurrent
            ? "border-[#994C1C]/20 bg-[#994C1C]/[0.03]"
            : "border-gray-200 bg-gray-50/50"
      )}
    >
      {/* Left: icon + title */}
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

      {/* Right: badge + dates */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge variant={status} size="sm">
          {statusText === "completed"
            ? "Completed"
            : statusText === "in_progress"
              ? "In Progress"
              : "Not Started"}
        </Badge>

        {/* Dates — identical to journey card style */}
        {(startDate || endDate) && (
          <div className="flex flex-col items-end gap-0.5 text-xs">
            {isCompleted ? (
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <Calendar className="size-3 text-muted-foreground" />
                {startDate} – {endDate}
              </span>
            ) : isCurrent ? (
              <>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="size-3" />
                  Started: <span className="font-semibold text-foreground">{startDate}</span>
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Flag className="size-3" />
                  Est. End: <span className="font-semibold text-foreground">{endDate}</span>
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="size-3" />
                  Est. Start: <span className="font-semibold text-foreground">{startDate}</span>
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Flag className="size-3" />
                  Est. End: <span className="font-semibold text-foreground">{endDate}</span>
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MilestoneItem;
