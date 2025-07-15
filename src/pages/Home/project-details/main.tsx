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

  const updateMilestoneFxn = (milestoneId: string) => {
    setText(milestoneId);
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
              <span className="text-sm font-semibold text-gray-900">.</span>
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
                  isLoading={updateProjectMilestone.isPending && aText === item.id}
                  key={item.id}
                />
              ))}
            </div>
          </div>

          {/* <p className="mt-2 text-sm text-gray-500">32 days to completion</p> */}
          <p className="mt-2 text-sm text-gray-500">
            Estimated {projectDetails?.timeline} to complete{" "}
            <span className="font-bold">{projectDetails?.milestone?.name}</span> phase,
            you are currently{" "}
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
        </div>
      </div>

      <div className="bg-white flex-1 h-full grid grid-cols-1 md:grid-cols-auth-layout rounded-lg border border-brand-border p-3">
        <ProjectInfoSection projectDetails={projectDetails} />
        <div className="p-0 md:p-3 md:pt-0 space-y-8">
          <>{renderMilestone()}</>
          <ProjectTabsSection projectDetails={projectDetails} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
