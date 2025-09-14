import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetProjectTypeDetails from "@/hooks/project-modules/project-types/use-get-project-type-details";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { LocateFixedIcon } from "lucide-react";
import MilestoneItem from "./milestone-item";

function UpcomingMilestones() {
  const { activeProject } = useClientProjectContext();
  const journey = useGetProjectTypeDetails(activeProject?.project_type_id ?? "");

  const currentMilestoneIndex =
    journey?.value?.data?.milestones?.findIndex(
      (milestone) => milestone.id === activeProject?.milestone?.id
    ) ?? 0;

  const renderBody = () => {
    if (journey.isPending)
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              className="flex items-center flex-wrap gap-2 justify-between rounded-lg border p-3 bg-slate-100 border-[#0000001A] h-[70px]"
              key={i}
            ></div>
          ))}
        </div>
      );

    if (journey?.isError)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    return (
      <div className="space-y-3">
        {journey?.value?.data?.milestones?.map((milestone, index) => (
          <MilestoneItem
            key={milestone.id}
            title={milestone.name}
            status={
              index < currentMilestoneIndex
                ? "completed"
                : index === currentMilestoneIndex
                  ? "in_progress"
                  : "blocked"
            }
            statusText={
              index < currentMilestoneIndex
                ? "completed"
                : index === currentMilestoneIndex
                  ? "in_progress"
                  : "not_started"
            }
            info={milestone.duration.toString()}
          />
        ))}
      </div>
    );
  };
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="text-lg flex gap-2 items-center">
          <LocateFixedIcon className="h-5 w-5 text-black" />
          Upcoming Milestones
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Key project milestones and deadlines
        </p>
      </CardHeader>
      <CardContent className="space-y-3">{renderBody()}</CardContent>
    </Card>
  );
}

export default UpcomingMilestones;
