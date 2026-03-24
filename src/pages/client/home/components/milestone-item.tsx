import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Clock, Dot } from "lucide-react";

function MilestoneItem({
  title,
  info,
  status,
  statusText,
}: {
  title: string;
  info: string;
  status: "in_progress" | "completed" | "blocked";
  statusText: string;
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
        <div className="space-y-0.5">
          <p className={cn("font-medium text-sm", !isCompleted && !isCurrent && "text-muted-foreground")}>
            {title}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" />
            {info} days
          </p>
        </div>
      </div>
      <Badge variant={status} size="sm">
        {statusText === "completed"
          ? "Completed"
          : statusText === "in_progress"
            ? "In Progress"
            : "Not Started"}
      </Badge>
    </div>
  );
}
export default MilestoneItem;
