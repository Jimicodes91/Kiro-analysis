import { Badge } from "@/components/ui/badge";
import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { cn } from "@/lib/utils";
import { MilestoneDateInfo, formatMilestoneDate } from "@/utils/milestone-dates";
import { Calendar, Check, Dot, Flag } from "lucide-react";

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
                "flex-1 flex items-center justify-between gap-3 flex-wrap rounded-lg border p-4 mb-3",
                isCompleted
                  ? "border-[#00AA3B]/20 bg-[#00AA3B]/[0.02]"
                  : isCurrent
                    ? "border-[#994C1C]/20 bg-[#994C1C]/[0.02] shadow-sm"
                    : "border-gray-200 bg-gray-50/50"
              )}
            >
              {/* Left: milestone info */}
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

              {/* Right: badge + dates */}
              <div className="flex flex-col items-end gap-2 shrink-0">
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

                {/* Dates — positioned where "X days" used to be */}
                {dateInfo && (
                  <div className="flex flex-col items-end gap-0.5 text-xs">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Calendar className="size-3 text-muted-foreground" />
                        {formatMilestoneDate(dateInfo.startDate)} – {formatMilestoneDate(dateInfo.endDate)}
                      </span>
                    ) : isCurrent ? (
                      <>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="size-3" />
                          Started: <span className="font-semibold text-foreground">{formatMilestoneDate(dateInfo.startDate)}</span>
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Flag className="size-3" />
                          Est. End: <span className="font-semibold text-foreground">{formatMilestoneDate(dateInfo.endDate)}</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="size-3" />
                          Est. Start: <span className="font-semibold text-foreground">{formatMilestoneDate(dateInfo.startDate)}</span>
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Flag className="size-3" />
                          Est. End: <span className="font-semibold text-foreground">{formatMilestoneDate(dateInfo.endDate)}</span>
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default JourneyListView;
