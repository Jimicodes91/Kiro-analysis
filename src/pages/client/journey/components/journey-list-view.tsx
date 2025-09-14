import { Badge } from "@/components/ui/badge";
import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { cn } from "@/lib/utils";
import { Check, Dot } from "lucide-react";

function JourneyListView({
  milestones,
  currentMilestoneIndex,
}: {
  milestones?: ProjectTypeMilestone[];
  currentMilestoneIndex: number;
}) {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-1000 ease-in-out">
      {milestones?.map((m, i) => (
        <div key={i} className="relative pl-8">
          {/* Connector line */}
          {i < milestones.length - 1 && (
            <span
              className={cn(
                "absolute left-[10px] top-7 h-full w-[1px] bg-muted-foreground/20",
                i < currentMilestoneIndex
                  ? "bg-[#307648]"
                  : i === currentMilestoneIndex
                    ? "bg-[#994C1C]"
                    : "blocked"
              )}
            />
          )}

          {/* Status Icon */}
          <span
            className={cn(
              "absolute left-0 top-2 size-5 rounded-full flex items-center justify-center",
              i < currentMilestoneIndex
                ? "bg-[#307648]"
                : i === currentMilestoneIndex
                  ? "border-[#994C1C] border"
                  : "border border-[#D7D7D7]"
            )}
          >
            {i < currentMilestoneIndex ? (
              <Check className="size-3.5 text-white" />
            ) : i === currentMilestoneIndex ? (
              <Dot className="size-6 text-[#994C1C]" />
            ) : (
              <Dot className="size-6 text-[#D7D7D7]" />
            )}
          </span>

          {/* Content */}
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-muted-foreground">
                {m?.description ?? "No description"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                variant={
                  i < currentMilestoneIndex
                    ? "completed"
                    : i === currentMilestoneIndex
                      ? "in_progress"
                      : "blocked"
                }
              >
                {i < currentMilestoneIndex
                  ? "Completed"
                  : i === currentMilestoneIndex
                    ? "In progress"
                    : "Not started"}
              </Badge>
              <p className="text-xs text-muted-foreground">Duration: {m.duration} days</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JourneyListView;
