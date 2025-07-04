import { ModalProps } from "@/components/ui/alert-dialog";
import useGetProjectDetails from "@/hooks/project-modules/use-get-project-details";
import getInitials, { getFormattedText } from "@/lib/utils";
import { ProjectDetails } from "@/types/api.types";
import React, { useState } from "react";
import { LuCalendar, LuUserRound } from "react-icons/lu";
import { PiSpinner } from "react-icons/pi";
import Modal from "../../../../components/Modal";
import { Badge } from "../../../../components/ui/badge";
import ViewToggle from "../../../../components/ui/view-toggle";
import ActivitLogSection from "../../project-details/template/project-activity-template";
import ProjectNoteSection from "../../project-details/template/project-note-template";
import ProjectTaskSection from "../../project-details/template/project-task-template";

interface ProjectModalProps {
  project: ProjectDetails;
}

const ProjectModal: React.FC<ProjectModalProps & ModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const projectDetails = useGetProjectDetails(project?.id);

  const renderBody = () => {
    if (projectDetails.isSuccess && projectDetails.value) {
      return <ProjectDetail project={projectDetails?.value?.data} />;
    }

    if (projectDetails.isError && projectDetails.error) {
      return <p>Something went wrong</p>;
    }
    return (
      <div className="space-y-4 animate-pulse pb-2">
        <div className="border-[1px] rounded-lg p-4 m-2 mt-4">
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="h-8 w-full max-w-xs bg-slate-200"></p>
              <p className="h-8 w-20 bg-slate-200"></p>
            </div>
            <div className="bg-slate-200 p-4 rounded-lg flex-col border-brand-border border-[1px] h-[140px]"></div>
          </div>
        </div>
        <div className="h-[90px] bg-slate-200  m-2 rounded-lg"></div>
        <div className="h-[180px] bg-slate-200 m-2 mb-2 rounded-lg"></div>
      </div>
    );
  };

  return (
    <>
      <Modal
        title="Project detail"
        closeModal={onClose}
        showExpandButton={true}
        expandRoute={`/projects/${project.id}`}
        isOpen={isOpen}
      >
        <>{renderBody()}</>
      </Modal>
    </>
  );
};

const ProjectDetail = ({ project }: { project: ProjectDetails }) => {
  const clientList = project?.form_fields?.find((item) => item.slug === "project_client")
    ?.value as { name: string }[];
  const [activeTab, setActiveTab] = useState("task");

  const renderSubTabContent = () => {
    switch (activeTab) {
      case "task":
        return (
          <ProjectTaskSection
            mode="readonly"
            projectId={project?.id}
            projectTypeId={project?.project_type_id}
          />
        );
      case "notes":
        return (
          <div>
            <ProjectNoteSection mode="readonly" projectId={project?.id} />
          </div>
        );
      case "activity":
        return (
          <div>
            <ActivitLogSection projectId={project?.id} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in-0 duration-700 ease-in-out">
      <div className="border-[1px] rounded-lg p-4 m-2 mt-4">
        <div className="space-y-4">
          <div className="flex flex-col">
            <p className="text-[#191819] font-bold text-2xl">{project.name}</p>
            <p className="text-brand-fade text-base font-medium">
              {project.form_data.client_organization}
            </p>
          </div>
          <div className="bg-[#F8F8F8] p-4 rounded-lg flex-col border-brand-border border-[1px]">
            <div className="mb-3 flex items-center gap-3 lg:gap-9 md:gap-1">
              <div className="flex items-center gap-2">
                <LuUserRound className="text-brand-fade w-4 h-4" />
                <h3 className="text-sm text-brand-fade">Owner(s)</h3>
              </div>
              <div>
                <div className="flex items-center -space-x-2">
                  {clientList?.map((item) => (
                    <div
                      key={item.name}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F1F1F1] text-dark text-xs font-medium ring-2 ring-white"
                    >
                      {getInitials(item.name)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-3 flex items-center gap-3 lg:gap-11 md:gap-1">
              <div className="flex items-center gap-2">
                <LuCalendar className="text-brand-fade w-4 h-4" />
                <h3 className="text-sm text-brand-fade">Timeline</h3>
              </div>
              <div>
                <p className="text-sm">{project?.project_timeline}</p>
              </div>
            </div>
            <div className="mb-3 flex items-center gap-3 lg:gap-11 md:gap-1">
              <div className="flex items-center gap-2">
                <PiSpinner className="text-brand-fade w-4 h-4" />
                <h3 className="text-sm text-brand-fade">Status</h3>
              </div>
              <div>
                <Badge size="sm" variant={project.status}>
                  {getFormattedText(project.status)}
                </Badge>
              </div>
            </div>
            {/* <div className="flex items-center gap-3 lg:gap-11 md:gap-1">
              <div className="flex items-center gap-2">
                <PiUsersThreeLight className="text-brand-fade w-4 h-4" />
                <h3 className="text-sm text-brand-fade">Assigned</h3>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="border-[1px] rounded-lg p-4 m-2 mt-4">
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-brand-fade text-sm font-semibold">
              Phase:
              <span className="text-[#000] mx-1 text-sm font-semibold capitalize">
                {project?.milestone?.name}
              </span>
            </p>

            <p className="text-[#000] mx-1 text-sm font-semibold">40%</p>
          </div>

          <p className="text-brand-fade text-sm font-semibold">
            {project?.project_timeline} to completion
          </p>
        </div>
      </div>
      <div className="border-[1px] rounded-lg p-4 m-2 space-y-3 mt-4">
        <div className="space-y-4">
          <ViewToggle
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            options={[
              { value: "task", label: "Task" },
              { value: "notes", label: "Notes" },
              { value: "activity", label: "Activity" },
            ]}
          />
        </div>
        <div>
          <>{renderSubTabContent()}</>
        </div>
      </div>
    </div>
  );
};
export default ProjectModal;
