import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Spade from "@/components/ui/spade";
import { ProjectDetails } from "@/types/api.types";
import { motion } from "framer-motion";
import { useState } from "react";
import { GoShare } from "react-icons/go";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ProjectSummary } from "./components/project-sumarry";

const text = [
  {
    title: "Onboarding",
    isActive: true,
  },
  {
    title: "Licensing",
    isActive: true,
  },

  {
    title: "Permit",
    isActive: true,
  },
  {
    title: "Travel",
    isActive: true,
  },
  {
    title: "Immigration",
    isActive: false,
  },
  {
    title: "Banking",
    isActive: false,
  },
  {
    title: "Renewal",
    isActive: false,
  },
];

type SubTabType =
  | "Task"
  | "Notes"
  | "Activity"
  | "Document"
  | "Message"
  | "Event"
  | "Project team";

const ProjectDetail = ({ projectDetails }: { projectDetails: ProjectDetails }) => {
  const navigate = useNavigate();

  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("Task");

  const subTabs: SubTabType[] = [
    "Task",
    "Notes",
    "Activity",
    "Document",
    "Message",
    "Event",
    "Project team",
  ];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "Task":
        return <div className="p-4">Task</div>;
      case "Notes":
        return <div className="p-4">Notes</div>;
      case "Activity":
        return <div className="p-4">Activity</div>;
      case "Document":
        return <div className="p-4">Document</div>;
      case "Message":
        return <div className="p-4">Message</div>;
      case "Event":
        return <div className="p-4">Event</div>;
      case "Project team":
        return <div className="p-4">Project team</div>;
      default:
        return null;
    }
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

      <div className="bg-white flex-1 h-full grid grid-cols-auth-layout rounded-lg border border-brand-border p-3">
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
          <div className="p-3 pt-0">
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-brand-border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Milestone</h3>
                <span className="text-sm font-semibold text-gray-900">40%</span>
              </div>
              <div className="flex items-center w-full text-white text-sm -space-x- font-medium">
                {text.map((item, index) => (
                  <Spade
                    isActive={item.isActive}
                    isFirst={index === 0}
                    text={item.title}
                    isLast={index === text.length - 1}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">32 days to completion</p>
            </div>
            <div className="bg-white rounded-lg border border-brand-border overflow-hidden">
              <div className="flex border-b border-gray-200">
                {subTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-3 relative text-[14px] text-black focus:outline-none transition-all duration-200 ${
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
                        layoutId={`underline-admin`}
                        id="underline-project"
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
