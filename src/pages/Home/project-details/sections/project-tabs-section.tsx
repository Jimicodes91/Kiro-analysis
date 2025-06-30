import { getIsClient } from "@/services/api.service";
import { ProjectDetails } from "@/types/api.types";
import { motion } from "framer-motion";
import React from "react";
import ActivitLogSection from "../template/project-activity-template";
import ProjectDocumentSection from "../template/project-document-template";
import ProjectEventSection from "../template/project-event-template";
import ProjectNoteSection from "../template/project-note-template";
import ProjectTaskSection from "../template/project-task-template";
import ProjectTeamSection from "../template/project-team-template";

type SubTabType =
  | "Task"
  | "Notes"
  | "Activity"
  | "Document"
  | "Message"
  | "Event"
  | "Project team";

function ProjectTabsSection({ projectDetails }: { projectDetails: ProjectDetails }) {
  const [activeSubTab, setActiveSubTab] = React.useState<SubTabType>("Task");
  const isClient = getIsClient();

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
            mode={isClient ? "readonly" : "edit"}
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
            <ProjectEventSection
              mode={isClient ? "readonly" : "edit"}
              projectId={projectDetails?.id}
            />
          </>
        );
      case "Project team":
        return <ProjectTeamSection projectId={projectDetails?.id} />;
      default:
        return null;
    }
  };

  return (
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
  );
}

export default ProjectTabsSection;
