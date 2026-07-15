import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import ViewToggle from "@/components/ui/view-toggle";
import useGetProjectTypeDetails from "@/hooks/project-modules/project-types/use-get-project-type-details";

import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { useMemo, useState } from "react";
import ProjectDurationBar from "../home/components/project-duration-bar";
import ClientJourneyForms from "./components/ClientJourneyForms";
import JourneyCardView from "./components/journey-card-view";
import JourneyListView from "./components/journey-list-view";

export default function ClientProjectJourney() {
  const [view, setView] = useState<string>("list");
  const { activeProject } = useClientProjectContext();
  const journey = useGetProjectTypeDetails(activeProject?.project_type_id ?? "");
  const journeyLength = journey?.value?.data?.milestones?.length || 1;

  const currentMilestoneIndex =
    journey?.value?.data?.milestones?.findIndex(
      (milestone) => milestone.id === activeProject?.milestone?.id
    ) ?? 0;

  const milestoneDates = useMemo(() => {
    const milestones = journey?.value?.data?.milestones;
    if (!milestones) return [];
    return calculateMilestoneDates(
      milestones,
      currentMilestoneIndex,
      activeProject?.start_date,
      (activeProject as any)?.milestone_start_date
    );
  }, [journey?.value?.data?.milestones, currentMilestoneIndex, activeProject]);

  const renderBody = () => {
    if (journey.isPending && !journey?.value)
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
        {view === "list" ? (
          /* --- List View (Timeline) --- */
          <JourneyListView
            milestones={journey?.value?.data?.milestones}
            currentMilestoneIndex={currentMilestoneIndex}
            milestoneDates={milestoneDates}
          />
        ) : (
          /* --- Grid View (Flow with Arrows) --- */
          <JourneyCardView
            milestones={journey?.value?.data?.milestones}
            currentMilestoneIndex={currentMilestoneIndex}
            milestoneDates={milestoneDates}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 page-fade-in">
      {/* Header */}
      <div>
        <Heading size="h3">Project Journey</Heading>
        <p className="text-muted-foreground">
          Track your project&apos;s milestones and progress
        </p>
      </div>

      {/* Progress Section */}
      <Card>
        <CardContent className="p-4">
          <ProjectDurationBar />
        </CardContent>
      </Card>

      {/* Milestones Section */}
      <Card>
        <CardHeader className="flex flex-col gap-5">
          <CardTitle className="text-xl">
            Milestones Timelines{" "}
            <span className="font-light text-lg">({journeyLength})</span>
          </CardTitle>
          <div className="flex items-center justify-between gap-2">
            <ViewToggle
              activeTab={view}
              setActiveTab={setView}
              options={[
                { value: "list", label: "List view " },
                { value: "grid", label: "Grid view" },
              ]}
            />
          </div>
        </CardHeader>

        <CardContent className="pt-5">{renderBody()}</CardContent>
      </Card>

      {/* NativeForms Section */}
      <ClientJourneyForms
        projectId={activeProject?.id ?? ""}
        projectTypeId={activeProject?.project_type_id ?? ""}
        milestoneId={activeProject?.milestone?.id ?? activeProject?.milestone_id ?? ""}
      />
    </div>
  );
}
