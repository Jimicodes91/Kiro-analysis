import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Spade from "@/components/ui/spade";
import { TableRowProps } from "@/types/components";
import { GoShare } from "react-icons/go";
import { IoArrowBack } from "react-icons/io5";
import ContactInfo from "../Project/Contactinfo";
import Detail from "./Detail";

const mockProjects: TableRowProps["row"][] = [
  {
    id: 1,
    title: "Project Alpha",
    organization: "Org A",
    startDate: "2023-01-01",
    dueDate: "2023-06-30",
    completedDate: "",
    status: "In progress",
    projectTeam: ["John D", "Jane S", "Mike J"],
    clientTeam: ["Client A", "Client B"],
  },
  {
    id: 2,
    title: "Project Beta",
    organization: "Org B",
    startDate: "2023-02-15",
    dueDate: "2023-08-15",
    completedDate: "",
    status: "Not started",
    projectTeam: ["Sarah W", "Tom H"],
    clientTeam: ["Client C"],
  },
  {
    id: 3,
    title: "Project Beta",
    organization: "Org B",
    startDate: "2023-02-15",
    dueDate: "2023-08-15",
    completedDate: "",
    status: "Not started",
    projectTeam: ["Sarah W", "Tom H"],
    clientTeam: ["Client C"],
  },
  {
    id: 4,
    title: "Project Beta",
    organization: "Org B",
    startDate: "2023-02-15",
    dueDate: "2023-08-15",
    completedDate: "",
    status: "Not started",
    projectTeam: ["Sarah W", "Tom H"],
    clientTeam: ["Client C"],
  },
];

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

type MainTabType = "Project detail" | "Contact info";
type SubTabType =
  | "Task"
  | "Notes"
  | "Activity"
  | "Document"
  | "Message"
  | "Event"
  | "Project team";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const project = mockProjects.find((p) => p.id === parseInt(id || ""));
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("Task");
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>("Project detail");

  const mainTabs: MainTabType[] = ["Project detail", "Contact info"];
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

  const renderMainTabContent = () => {
    if (!project) return null;

    switch (activeMainTab) {
      case "Project detail":
        return (
          <Detail
            title={project.title}
            organization={project.organization}
            startDate={project.startDate}
            client="John Doe"
            dueDate={project.dueDate}
            status={project.status}
            projectTeam={project.projectTeam || []}
            description="A document is a written or digital file that records information, data, or ideas. It can take various forms, such as a report, letter, proposal, article, or presentation."
          />
        );
      case "Contact info":
        return (
          <ContactInfo
            projectTeam={project.projectTeam || []}
            clientTeam={project.clientTeam || []}
            owner="Uchenna Okenwa"
          />
        );
      default:
        return null;
    }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg">
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

      <div className="bg-white flex rounded-lg border border-brand-border p-3 overflow-hidden">
        <div className="w-1/4 mb-8 p-4 rounded-lg border">
          <div className="flex flex-col gap-1 mb-4">
            <Heading size="h4" className="leading-[22px]">
              ElevatePro Digital Transformation
            </Heading>
            <p className="text-[#19181980] text-sm font-light">Stellar Solutions Inc.</p>
          </div>

          <div className="bg-[#F8F8F8] p-4 rounded-lg border">
            <h3 className="text-xs mb-1">Description</h3>
            <p className="text-xs text-[#191819B2]">
              A document is a written or digital file that records information, data, or
              ideas. It can take various forms, such as a report, letter, proposal,
              article, or presentation,
            </p>
          </div>
          <div className="bg-white rounded-lg border border-brand-border overflow-hidden mt-5">
            <div className="flex border-b border-gray-200">
              {mainTabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                    activeMainTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveMainTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6">{renderMainTabContent()}</div>
          </div>
        </div>
        <div className="w-3/4">
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
                    className={`px-6 py-3 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                      activeSubTab === tab
                        ? "text-primary border-b-2 border-primary "
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveSubTab(tab)}
                  >
                    {tab}
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
