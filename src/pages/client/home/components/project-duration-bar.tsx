import { Progress } from "@/components/ui/progress";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetProjectTypeDetails from "@/hooks/project-modules/project-types/use-get-project-type-details";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { ProjectDetails } from "@/types/api.types";

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

  return (
    <div className="p-4 space-y-2 bg-[#FBFBFB] border border-[#0000000A] rounded-lg page-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm">
          {activeProject?.milestone?.name}{" "}
          <span className="text-muted-foreground">
            (duration {activeProject?.milestone?.duration} days)
          </span>
        </p>
        <p className="text-sm mt-1 text-right font-medium">{progress}%</p>
      </div>

      <Progress value={progress} className="h-2" />
    </div>
  );
}

export default ProjectDurationBar;
