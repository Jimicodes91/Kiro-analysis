import { Badge } from "@/components/ui/badge";
import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";

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
        <div key={i} className="relative pl-6">
          {/* Connector line */}
          {i < milestones.length - 1 && (
            <span className="absolute left-2 top-6 h-full w-[2px] bg-muted-foreground/20" />
          )}

          {/* Status Icon */}
          <span className="absolute left-0 top-2">
            {i < currentMilestoneIndex ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : i === currentMilestoneIndex ? (
              <CircleDot className="h-4 w-4 text-amber-500" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
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
