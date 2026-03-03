import { Card, CardContent } from "@/components/ui/card";
import useGetProjectTypeDetails from "@/hooks/project-modules/project-types/use-get-project-type-details";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { LocateFixedIcon } from "lucide-react";

function MilestoneMetricCard() {
  const { activeProject } = useClientProjectContext();
  const journey = useGetProjectTypeDetails(activeProject?.project_type_id ?? "");
  const journeyLength = journey?.value?.data?.milestones?.length || 1;
  const currentMilestoneIndex =
    journey?.value?.data?.milestones?.findIndex(
      (milestone) => milestone.id === activeProject?.milestone?.id
    ) ?? 0;

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <LocateFixedIcon className="size-9 text-black" />
        <div className="space-y-1">
          <p className="text-[#191819]">Milestones</p>
          <p className="text-2xl font-bold">
            {journey?.isPending ? (
              <div className="h-8 w-[80px] bg-slate-300 animate-pulse"></div>
            ) : (
              <span className="fade-in">
                {currentMilestoneIndex + 1}/{journeyLength}
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default MilestoneMetricCard;
