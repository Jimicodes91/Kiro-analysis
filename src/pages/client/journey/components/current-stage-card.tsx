import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import useGetProjectTasks from "@/hooks/project-modules/tasks/use-get-project-tasks";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import { MilestoneDateInfo, formatMilestoneDate } from "@/utils/milestone-dates";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight, Flag, ListChecks } from "lucide-react";
import { useMemo } from "react";

/**
 * The "Current stage" card from the Journey reference: current milestone name,
 * started + estimated-completion dates, and the outstanding actions the client
 * still needs to take (their non-completed tasks, each clickable through to the
 * task). Mirrors the Home "Needs your attention" definition — tasks only, no
 * fabricated items.
 */
function CurrentStageCard({
  currentMilestone,
  currentMilestoneDates,
}: {
  currentMilestone?: ProjectTypeMilestone;
  currentMilestoneDates?: MilestoneDateInfo;
}) {
  const navigate = useNavigate();
  const { activeProject } = useClientProjectContext();
  const user = getUserSession();
  const projectId = activeProject?.id ?? "";
  const projectTasks = useGetProjectTasks(projectId, user?.id);

  const outstandingTasks = useMemo(
    () =>
      (projectTasks?.value?.data ?? []).filter((t) => t.status !== "completed"),
    [projectTasks?.value?.data]
  );

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="text-lg">
          Current stage:{" "}
          <span className="text-primary">
            {currentMilestone?.name ?? activeProject?.milestone?.name ?? "—"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dates */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {currentMilestoneDates?.startDate && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="size-3.5" />
              Started:{" "}
              <span className="font-semibold text-foreground">
                {formatMilestoneDate(currentMilestoneDates.startDate)}
              </span>
            </span>
          )}
          {currentMilestoneDates?.endDate && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Flag className="size-3.5" />
              Estimated completion:{" "}
              <span className="font-semibold text-foreground">
                {formatMilestoneDate(currentMilestoneDates.endDate)}
              </span>
            </span>
          )}
        </div>

        {/* Outstanding actions */}
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <ListChecks className="size-4" />
            Outstanding actions
          </p>

          {projectTasks?.isPending ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : outstandingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No outstanding actions for this stage.
            </p>
          ) : (
            <div className="space-y-2">
              {outstandingTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => navigate(`/tasks/${projectId}/${task.id}`)}
                  className="w-full flex items-center justify-between gap-3 rounded-lg border border-[#0000001A] bg-[#F8F8F8] px-3 py-2 text-left transition-colors hover:bg-gray-100"
                >
                  <span className="text-sm text-primary truncate">{task.name}</span>
                  <ChevronRight className="size-4 shrink-0 text-brand-fade" />
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default CurrentStageCard;
