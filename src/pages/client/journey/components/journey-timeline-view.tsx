import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { cn } from "@/lib/utils";
import { MilestoneDateInfo, formatMilestoneDate } from "@/utils/milestone-dates";
import { Check } from "lucide-react";

type MilestoneStatus = "completed" | "in_progress" | "not_started";

/**
 * Horizontal milestone timeline (Asana-style). Shows every stage as a node in
 * a row — a tick for completed stages, a filled ring for the current stage, and
 * a muted dot for upcoming stages — with the stage name and its date range
 * beneath each node. Scrolls horizontally on small screens.
 */
function JourneyTimelineView({
  milestones,
  currentMilestoneIndex,
  milestoneDates,
}: {
  milestones?: ProjectTypeMilestone[];
  currentMilestoneIndex: number;
  milestoneDates?: MilestoneDateInfo[];
}) {
  if (!milestones?.length) return null;

  const getStatus = (index: number): MilestoneStatus => {
    if (index < currentMilestoneIndex) return "completed";
    if (index === currentMilestoneIndex) return "in_progress";
    return "not_started";
  };

  return (
    <div className="overflow-x-auto pb-2 animate-in fade-in-0 duration-700 ease-in-out">
      <div
        className="grid gap-0 min-w-[560px]"
        style={{
          gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))`,
        }}
      >
        {milestones.map((m, index) => {
          const status = getStatus(index);
          const dateInfo = milestoneDates?.[index];
          const isFirst = index === 0;
          const isLast = index === milestones.length - 1;

          const dateLabel = dateInfo
            ? `${formatMilestoneDate(dateInfo.startDate)} → ${formatMilestoneDate(
                dateInfo.endDate
              )}`
            : null;

          return (
            <div key={m.id ?? index} className="flex flex-col items-center text-center">
              {/* Node + connecting lines */}
              <div className="relative flex items-center justify-center w-full">
                {/* Left connector */}
                {!isFirst && (
                  <span
                    className={cn(
                      "absolute right-1/2 top-1/2 -translate-y-1/2 h-0.5 w-full",
                      index <= currentMilestoneIndex ? "bg-[#00AA3B]" : "bg-gray-200"
                    )}
                  />
                )}
                {/* Right connector */}
                {!isLast && (
                  <span
                    className={cn(
                      "absolute left-1/2 top-1/2 -translate-y-1/2 h-0.5 w-full",
                      index < currentMilestoneIndex ? "bg-[#00AA3B]" : "bg-gray-200"
                    )}
                  />
                )}

                {/* Node */}
                <span
                  className={cn(
                    "relative z-10 flex size-9 items-center justify-center rounded-full border-2 bg-white",
                    status === "completed" && "border-[#00AA3B] bg-[#00AA3B]",
                    status === "in_progress" && "border-primary",
                    status === "not_started" && "border-gray-300"
                  )}
                >
                  {status === "completed" ? (
                    <Check className="size-4 text-white" />
                  ) : status === "in_progress" ? (
                    <span className="size-3 rounded-full bg-primary" />
                  ) : (
                    <span className="size-2 rounded-full bg-gray-300" />
                  )}
                </span>
              </div>

              {/* Label */}
              <div className="mt-2 px-1">
                <p
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    status === "not_started" ? "text-muted-foreground" : "text-primary"
                  )}
                >
                  {m.name}
                </p>
                {dateLabel && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{dateLabel}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default JourneyTimelineView;
