import { Progress } from "@/components/ui/progress";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetProjectTypeDetails from "@/hooks/project-modules/project-types/use-get-project-type-details";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { ProjectDetails } from "@/types/api.types";
import { calculateMilestoneDates, formatMilestoneDate } from "@/utils/milestone-dates";
import { Calendar, Flag } from "lucide-react";
import { useMemo } from "react";

function ProjectDurationBar() {
  const { activeProject } = useClientProjectContext();
  const journey = useGetProjectTypeDetails(activeProject?.project_type_id ?? "");

  if (journey.isPending && !journey?.value?.data) {
    return (
      <div className="h-[74px] p-4 space-y-2 bg-[#FBFBFB] border border-[#0000000A] rounded-lg">
        <div className="flex items-center justify-between">
          <div className="w-32 h-5 bg-slate-200 animate-pulse"></div>
          <div className="w-20 h-5 bg-slate-200 animate-pulse"></div>
        </div>
        <div className="w-full rounded-md h-3 bg-slate-200 animate-pulse"></div>
      </div>
    );
  }

  if (journey?.value?.data) {
    return (
      <DurationBar
        activeProject={activeProject as ProjectDetails}
        journey={journey?.value?.data as ProjectType}
      />
    );
  }
  return null;
}

function DurationBar({
  activeProject,
  journey,
}: {
  activeProject: ProjectDetails;
  journey: ProjectType;
}) {
  const journeyLength = journey?.milestones?.length || 1;
  const perMilestone = 100 / journeyLength;
  const currentMilestoneIndex = journey?.milestones?.findIndex(
    (milestone) => milestone.id === activeProject?.milestone?.id
  );
  const progress = Math.round(
    (currentMilestoneIndex === -1 ? 0 : currentMilestoneIndex + 1) * perMilestone
  );

  // Calculate overall project dates
  const milestoneDates = useMemo(() => {
    if (!journey?.milestones?.length) return [];
    return calculateMilestoneDates(
      journey.milestones,
      currentMilestoneIndex === -1 ? 0 : currentMilestoneIndex,
      activeProject?.start_date,
      (activeProject as any)?.milestone_start_date
    );
  }, [journey?.milestones, currentMilestoneIndex, activeProject]);

  const projectStartDate = activeProject?.start_date
    ? new Date(activeProject.start_date)
    : null;

  // Overall estimated end = end date of the LAST milestone
  const overallEndDate = milestoneDates.length > 0
    ? milestoneDates[milestoneDates.length - 1]?.endDate
    : null;

  return (
    <div className="p-4 space-y-3 bg-[#FBFBFB] border border-[#0000000A] rounded-lg page-fade-in">
      {/* Top row: current milestone + progress */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {activeProject?.milestone?.name}
        </p>
        <p className="text-sm font-semibold">{progress}%</p>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Bottom row: overall start → estimated completion */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3" />
          Start: <span className="font-semibold text-foreground">{formatMilestoneDate(projectStartDate)}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Flag className="size-3" />
          Est. Completion: <span className="font-semibold text-foreground">{formatMilestoneDate(overallEndDate)}</span>
        </span>
      </div>
    </div>
  );
}

export default ProjectDurationBar;
