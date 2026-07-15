import { Badge } from "@/components/ui/badge";
import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { cn } from "@/lib/utils";
import { MilestoneDateInfo, formatMilestoneDate } from "@/utils/milestone-dates";
import { Calendar, Check, Clock, Dot, Flag } from "lucide-react";

function JourneyListView({
  milestones,
  currentMilestoneIndex,
  milestoneDates,
}: {
  milestones?: ProjectTypeMilestone[];
  currentMilestoneIndex: number;
  milestoneDates?: MilestoneDateInfo[];
}) {
  return (
    <div className="space-y-0 animate-in fade-in-0 duration-700 ease-in-out">
      {milestones?.map((m, i) => {
        const isCompleted = i < currentMilestoneIndex;
        const isCurrent = i === currentMilestoneIndex;
        const isLast = i === (milestones?.length ?? 0) - 1;
        const dateInfo = milestoneDates?.[i];

        return (
          <div key={m.id ?? i} className="relative flex gap-4">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              {/* Status circle */}
              <div
                className={cn(
                  "flex items-center justify-center size-8 rounded-full shrink-0 z-10",
                  isCompleted
                    ? "bg-[#00AA3B]"
                    : isCurrent
                      ? "bg-white border-2 border-[#994C1C]"
                      : "bg-white border-2 border-gray-300"
                )}
              >
                {isCompleted ? (
                  <Check className="size-4 text-white" />
                ) : isCurrent ? (
                  <Dot className="size-8 text-[#994C1C]" />
                ) : (
                  <span className="size-2 rounded-full bg-gray-300" />
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[16px]",
                    isCompleted ? "bg-[#00AA3B]" : "bg-gray-200"
                  )}
                />
              )}
            </div>

            {/* Content card */}
            <div
              className={cn(
                "flex-1 flex flex-col gap-2 rounded-lg border p-4 mb-3",
                isCompleted
                  ? "border-[#00AA3B]/20 bg-[#00AA3B]/[0.02]"
                  : isCurrent
                    ? "border-[#994C1C]/20 bg-[#994C1C]/[0.02] shadow-sm"
                    : "border-gray-200 bg-gray-50/50"
              )}
            >
              {/* Top row: name + badge */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      !isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {m.name}
                  </p>
                  {m?.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {m.description}
                    </p>
                  )}
                </div>

                <Badge
                  variant={
                    isCompleted
                      ? "completed"
                      : isCurrent
                        ? "in_progress"
                        : "blocked"
                  }
                  size="sm"
                >
                  {isCompleted
                    ? "Completed"
                    : isCurrent
                      ? "In Progress"
                      : "Not Started"}
                </Badge>
              </div>

              {/* Date row — replaces "X days" */}
              {dateInfo && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/50">
                  {isCompleted ? (
                    // Completed: show date range
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      <span>
                        {formatMilestoneDate(dateInfo.startDate)} – {formatMilestoneDate(dateInfo.endDate)}
                      </span>
                    </div>
                  ) : isCurrent ? (
                    // Current: show started + est. end
                    <>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3" />
                        <span>Started: {formatMilestoneDate(dateInfo.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flag className="size-3" />
                        <span>Est. End: {formatMilestoneDate(dateInfo.endDate)}</span>
                      </div>
                    </>
                  ) : (
                    // Future: show est. start + est. end
                    <>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3" />
                        <span>Est. Start: {formatMilestoneDate(dateInfo.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flag className="size-3" />
                        <span>Est. End: {formatMilestoneDate(dateInfo.endDate)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <Clock className="size-3" />
                    <span>{m.duration} {m.duration === 1 ? "day" : "days"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default JourneyListView;
