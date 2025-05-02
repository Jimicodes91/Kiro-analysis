import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import Spade from "@/components/ui/spade";
import useGetProjectTypeDetails from "@/hooks/project-modules/project-types/use-get-project-type-details";
import useGetProjectDetails from "@/hooks/project-modules/use-get-project-details";
import useUpdateProjectMilestone from "@/hooks/project-modules/use-update-project-milestone";
import { ProjectDetails } from "@/types/api.types";
import { motion } from "framer-motion";
import { useState } from "react";
import { GoShare } from "react-icons/go";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ProjectSummary } from "./components/project-sumarry";
import ActivitLogSection from "./template/project-activity-section";
import ProjectDocumentSection from "./template/project-document-section";
import ProjectEventSection from "./template/project-event-section";
import ProjectNoteSection from "./template/project-note-section";
import ProjectTaskSection from "./template/project-task-section";
import ProjectTeamSection from "./template/project-team-section";

type SubTabType =
  | "Task"
  | "Notes"
  | "Activity"
  | "Document"
  | "Message"
  | "Event"
  | "Project team";

const ProjectDetail = ({
  projectDetails,
  refetchProject,
}: {
  projectDetails: ProjectDetails;
  refetchProject: ReturnType<typeof useGetProjectDetails>["refetch"];
}) => {
  const navigate = useNavigate();
  const journey = useGetProjectTypeDetails(projectDetails?.project_type_id);
  const updateProjectMilestone = useUpdateProjectMilestone(projectDetails.id);

  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("Task");

  const subTabs: SubTabType[] = [
    "Task",
    "Notes",
    "Activity",
    "Document",
    "Event",
    "Project team",
  ];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "Task":
        return (
          <ProjectTaskSection
            projectId={projectDetails?.id}
            projectTypeId={projectDetails?.project_type_id}
          />
        );
      case "Notes":
        return (
          <div>
            <ProjectNoteSection projectId={projectDetails?.id} />
          </div>
        );
      case "Activity":
        return (
          <div>
            <ActivitLogSection projectId={projectDetails?.id} />
          </div>
        );
      case "Document":
        return (
          <div>
            <ProjectDocumentSection projectId={projectDetails.id} />
          </div>
        );

      case "Event":
        return (
          <>
            <ProjectEventSection projectId={projectDetails?.id} />
          </>
        );
      case "Project team":
        return <ProjectTeamSection projectId={projectDetails?.id} />;
      default:
        return null;
    }
  };

  const updateMilestoneFxn = (milestoneId: string) => {
    updateProjectMilestone
      .mutateAsync({
        milestone_id: milestoneId,
      })
      .then(() => refetchProject())
      .catch(console.error);
  };
  const renderMilestone = () => {
    if (journey.isSuccess && journey?.value) {
      return (
        <div className="px-4 py-6 bg-gray-50 rounded-lg border space-y-4 border-brand-border">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Milestone</h3>
              <span className="text-sm font-semibold text-gray-900">40%</span>
            </div>
            <div className="flex items-center w-full text-white text-sm  font-medium">
              {journey?.value?.data?.milestones?.map((item, index, arr) => (
                <Spade
                  isActive={
                    arr.findIndex((item) => item.id === projectDetails?.milestone_id) >=
                    index
                  }
                  isFirst={index === 0}
                  text={item.name}
                  isLast={index === arr.length - 1}
                  onClick={() => {
                    if (item.id !== projectDetails?.milestone_id) {
                      updateMilestoneFxn(item.id);
                    }
                  }}
                  key={item.id}
                />
              ))}
              {updateProjectMilestone.isPending && (
                <div className="ml-2">
                  <Icons.spinner className="text-primary animate-spin h-4 w-4" />
                </div>
              )}
            </div>
          </div>

          {/* <p className="mt-2 text-sm text-gray-500">32 days to completion</p> */}
          <p className="mt-2 text-sm text-gray-500">
            Estimated {projectDetails?.timeline} to completion
          </p>
        </div>
      );
    }
    if (journey.isError && journey.error) {
      return <p>Something went wrong</p>;
    }

    return <div className="w-full h-[140px] bg-slate-200 rounded-lg"></div>;
  };
  return (
    <div className="p-6 animate-in h-full flex flex-col min-h-[calc(100vh-70px)] fade-in-0 duration-700 ease-in-out">
      <div>
        <div className="mb-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-dark hover:text-[#191819B2] transition-colors"
          >
            <IoArrowBack className="mr-2" />
            Back to Projects
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-[#191819] ">Project detail</h1>
          <Button variant="outline" size="sm" leftIcon={<GoShare className="" />}>
            Export
          </Button>
        </div>
      </div>

      <div className="bg-white flex-1 h-full grid grid-cols-1 md:grid-cols-auth-layout rounded-lg border border-brand-border p-3">
        <div className="mb-8 p-4 space-y-4 rounded-lg border">
          <div className="flex flex-col gap-1">
            <Heading size="h4" className="leading-[22px]">
              {projectDetails?.name}
            </Heading>
            <p className="text-brand-fade text-sm font-light">
              {projectDetails?.form_data?.client_organization}
            </p>
          </div>

          <div className="bg-[#F8F8F8] p-3 rounded-lg border">
            <h3 className="text-xs mb-1">Description</h3>
            <p className="text-xs text-[#191819B2]">
              {projectDetails?.form_data?.description
                ? projectDetails?.form_data?.description
                : "No description added"}
            </p>
          </div>
          <div className="">
            <ProjectSummary projectDetails={projectDetails} />
          </div>
        </div>
        <div className="">
          <div className="p-0 md:p-3 md:pt-0 space-y-8">
            <>{renderMilestone()}</>
            <div className="bg-white rounded-lg grid border border-brand-border relative">
              <div className="flex border-b border-gray-200 overflow-auto sticky top-[10px]">
                {subTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-3 relative whitespace-nowrap text-[14px] text-black focus:outline-none outline-none boder-0 transition-all duration-200 ${
                      activeSubTab === tab
                        ? "font-bold"
                        : "opacity-30 hover:opacity-40 hover:bg-gray-50 font-[500]"
                    }`}
                    onClick={() => setActiveSubTab(tab)}
                  >
                    {tab}
                    {activeSubTab === tab ? (
                      <motion.div
                        className="absolute bottom-0 left-0 rounded-full h-0.5 w-full bg-primary"
                        layoutId={`underline-project-tabs`}
                        id="underline-project-tabs"
                      />
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="p-6">{renderSubTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
