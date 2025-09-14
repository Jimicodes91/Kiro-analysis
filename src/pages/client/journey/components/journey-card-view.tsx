import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";

import { MoveDown, MoveRight } from "lucide-react";

function JourneyCardView({
  milestones,
  currentMilestoneIndex,
}: {
  milestones?: ProjectTypeMilestone[];
  currentMilestoneIndex: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in-0 duration-1000 ease-in-out">
      {milestones?.map((m, index, arr) => (
        <div key={index} className="relative flex flex-col items-center">
          <Card className="w-full bg-[#F3F3F3] shadow-none border border-[#0000001A]">
            <CardContent className="p-4 space-y-2">
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-muted-foreground">
                {m?.description ?? "No description"}
              </p>
              <div className="flex justify-between  gap-2 flex-wrap items-center">
                <p className="text-xs text-muted-foreground">
                  Duration: {m.duration} days
                </p>
                <Badge
                  variant={
                    index < currentMilestoneIndex
                      ? "completed"
                      : index === currentMilestoneIndex
                        ? "in_progress"
                        : "blocked"
                  }
                >
                  {index < currentMilestoneIndex
                    ? "Completed"
                    : index === currentMilestoneIndex
                      ? "In progress"
                      : "Not started"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Simple arrow connector (example, adjust per row/col) */}
          {index < milestones.length - 1 && index !== 2 && (
            <span className="absolute right-[-30px] top-1/2 hidden md:block">
              <MoveRight className="h-5 w-5 text-muted-foreground" />
            </span>
          )}
          {index === 2 && arr.length > 3 && (
            <span className="absolute left-1/2 bottom-[-30px] transform -translate-x-1/2">
              <MoveDown className="h-5 w-5 text-muted-foreground" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default JourneyCardView;
