import Heading from "@/components/ui/heading";
import Spade from "@/components/ui/spade";
import useGetProjectTypeDetails from "@/hooks/project-modules/project-types/use-get-project-type-details";
import useGetProjectDetails from "@/hooks/project-modules/use-get-project-details";
import useUpdateProjectMilestone from "@/hooks/project-modules/use-update-project-milestone";
import { ProjectDetails } from "@/types/api.types";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ProjectInfoSection from "./sections/project-info-section";
import ProjectTabsSection from "./sections/project-tabs-section";

const ProjectDetail = ({
  projectDetails,
  refetchProject,
}: {
  projectDetails: ProjectDetails;
  refetchProject: ReturnType<typeof useGetProjectDetails>["refetch"];
}) => {
  const [aText, setText] = useState<null | string>(null);
  const navigate = useNavigate();
  const journey = useGetProjectTypeDetails(projectDetails?.project_type_id);
  const updateProjectMilestone = useUpdateProjectMilestone(projectDetails.id);

  const updateMilestoneFxn = (milestoneId: string, isLast?: boolean) => {
    setText(milestoneId);
    updateProjectMilestone
      .mutateAsync({
        milestone_id: milestoneId,
      })
      .then(() => {
        refetchProject();
        console.log(isLast ? "Last milestone updated" : "Milestone updated");
      })
      .catch(console.error);
  };

  const renderMilestone = () => {
    if (journey.isSuccess && journey?.value) {
      return (
        <div className="px-5 py-5 bg-gray-50 rounded-lg border border-brand-border space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Milestone</h3>
          <div className="flex items-center w-full overflow-x-auto text-sm font-medium">
            {journey?.value?.data?.milestones?.map((item, index, arr) => (
              <Spade
                isActive={
                  arr.findIndex((m) => m.id === projectDetails?.milestone_id) >= index
                }
                isFirst={index === 0}
                text={item.name}
                isLast={index === arr.length - 1}
                onClick={() => {
                  if (item.id !== projectDetails?.milestone_id) {
                    updateMilestoneFxn(item.id, index === arr.length - 1);
                  }
                }}
                isLoading={updateProjectMilestone.isPending && aText === item.id}
                key={item.id}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Estimated {projectDetails?.timeline} to complete{" "}
            <span className="font-bold">{projectDetails?.milestone?.name}</span> phase
            — currently{" "}
            {projectDetails?.milestone_status === "on_track"
              ? "on track"
              : "behind schedule"}
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
    <div className="p-3 sm:p-4 md:p-6 animate-in h-full flex flex-col min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-70px)] fade-in-0 duration-700 ease-in-out max-w-[1440px] mx-auto w-full">
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
          <Heading size="h3">Project detail</Heading>
        </div>
      </div>

      <div className="bg-white flex-1 h-full grid grid-cols-1 lg:grid-cols-project-detail rounded-lg border border-brand-border p-3">
        <ProjectInfoSection projectDetails={projectDetails} />
        <div className="p-3 lg:pt-0 space-y-8">
          <>{renderMilestone()}</>
          <ProjectTabsSection projectDetails={projectDetails} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
