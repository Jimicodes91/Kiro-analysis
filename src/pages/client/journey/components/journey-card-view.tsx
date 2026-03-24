import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { cn } from "@/lib/utils";
import { Check, Clock, Lock } from "lucide-react";

function JourneyCardView({
  milestones,
  currentMilestoneIndex,
}: {
  milestones?: ProjectTypeMilestone[];
  currentMilestoneIndex: number;
}) {
  const getStatus = (index: number) => {
    if (index < currentMilestoneIndex) return "completed";
    if (index === currentMilestoneIndex) return "in_progress";
    return "not_started";
  };

  const statusConfig = {
    completed: {
      icon: Check,
      iconBg: "bg-[#00AA3B]",
      iconColor: "text-white",
      cardBorder: "border-[#00AA3B]/30",
      cardBg: "bg-[#00AA3B]/[0.03]",
      accentBar: "bg-[#00AA3B]",
      badge: "completed" as const,
      label: "Completed",
    },
    in_progress: {
      icon: Clock,
      iconBg: "bg-[#994C1C]",
      iconColor: "text-white",
      cardBorder: "border-[#994C1C]/30",
      cardBg: "bg-[#994C1C]/[0.03]",
      accentBar: "bg-[#994C1C]",
      badge: "in_progress" as const,
      label: "In Progress",
    },
    not_started: {
      icon: Lock,
      iconBg: "bg-gray-200",
      iconColor: "text-gray-500",
      cardBorder: "border-gray-200",
      cardBg: "bg-gray-50/50",
      accentBar: "bg-gray-300",
      badge: "blocked" as const,
      label: "Not Started",
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in-0 duration-700 ease-in-out">
      {milestones?.map((m, index) => {
        const status = getStatus(index);
        const config = statusConfig[status];
        const Icon = config.icon;

        return (
          <Card
            key={m.id ?? index}
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              config.cardBorder,
              config.cardBg,
              status === "in_progress" && "shadow-md ring-1 ring-[#994C1C]/10"
            )}
          >
            {/* Top accent bar */}
            <div className={cn("h-1 w-full", config.accentBar)} />

            <CardContent className="p-4 pt-3 space-y-3">
              {/* Step header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex items-center justify-center size-8 rounded-full shrink-0",
                      config.iconBg
                    )}
                  >
                    <Icon className={cn("size-4", config.iconColor)} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Step {index + 1}
                  </span>
                </div>
                <Badge variant={config.badge} size="sm">
                  {config.label}
                </Badge>
              </div>

              {/* Milestone name */}
              <div>
                <p className={cn(
                  "font-semibold text-sm leading-tight",
                  status === "not_started" ? "text-muted-foreground" : "text-foreground"
                )}>
                  {m.name}
                </p>
                {m?.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {m.description}
                  </p>
                )}
              </div>

              {/* Duration footer */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
                <Clock className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {m.duration} {m.duration === 1 ? "day" : "days"}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default JourneyCardView;
