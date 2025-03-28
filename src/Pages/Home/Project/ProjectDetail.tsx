import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { LuCalendar, LuUserRound } from "react-icons/lu";
import { PiSpinner } from "react-icons/pi";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { RiStickyNoteLine } from "react-icons/ri";
import { BsActivity } from "react-icons/bs";

import { IoSettingsOutline, IoArrowBack } from "react-icons/io5";
import { TableRowProps } from "../../../types";
import ViewToggle from "../../../Components/Cards/ViewToggle";
import Detail from "./Detail";
import ContactInfo from "./Contactinfo";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  assignedTo?: string;
}

interface Note {
  id: number;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface Activity {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

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

type TabType = "Project detail" | "Contact info";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("task");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete Project Proposal",
      description: "Draft and finalize the project proposal for client review.",
      completed: true,
    },
    {
      id: 2,
      title: "Team Meeting",
      description:
        "Attend the weekly team meeting to discuss project progress.",
      completed: false,
    },
    {
      id: 3,
      title: "Code Review",
      description:
        "Review pull requests and provide feedback on recent code changes.",
      completed: false,
    },
  ]);

  const [notes] = useState<Note[]>([
    {
      id: 1,
      content:
        "Client requested additional features in the dashboard. Need to discuss scope.",
      createdAt: "2023-05-10T10:30:00",
      createdBy: "Uchenna Okenwa",
    },
    {
      id: 2,
      content:
        "Budget approval pending from finance team. Follow up scheduled for Friday.",
      createdAt: "2023-05-08T14:15:00",
      createdBy: "Sarah Williams",
    },
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: 1,
      action: "Status Update",
      details: "Changed status from 'Not Started' to 'In Progress'",
      timestamp: "2023-05-12T09:45:00",
      user: "Uchenna Okenwa",
    },
    {
      id: 2,
      action: "Task Completed",
      details: "Marked 'Project Proposal' as completed",
      timestamp: "2023-05-11T16:20:00",
      user: "Jane Smith",
    },
    {
      id: 3,
      action: "Team Update",
      details: "Added Mike Johnson to the project team",
      timestamp: "2023-05-10T11:10:00",
      user: "Uchenna Okenwa",
    },
  ]);

  const project = mockProjects.find((p) => p.id === parseInt(id || ""));

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const [activeTab2, setActiveTab2] = useState<TabType>("Project detail");

  const tabs: TabType[] = ["Project detail", "Contact info"];

  const renderTabContent = () => {
    if (!project) return null;

    switch (activeTab2) {
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
          <h2 className="text-2xl font-bold text-gray-800">
            Project not found
          </h2>
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
    <div className="container mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-dark hover:text-[#191819B2] transition-colors"
        >
          <IoArrowBack className="mr-2" />
          Back to Projects
        </button>
      </div>
      <h1 className="text-2xl font-semibold text-[#191819] mb-3">
        Project detail
      </h1>

      <div className="bg-white flex rounded-lg shadow-md border border-[#0000001A] p-3 overflow-hidden">
        <div className="w-1/4 mb-8 p-4 rounded-lg border mr-5 ">
          <div className="flex flex-col gap-1 mb-4">
            <p className="text-[#191819] font-medium text-lg">
              {project.title}
            </p>
            <p className="text-[#19181980] text-base font-medium">
              {project.organization}
            </p>
          </div>

          <div className="bg-[#F8F8F8] p-4 rounded-lg border">
            <h3 className="text-xs mb-1">Description</h3>
            <p className="text-xs text-[#191819B2]">
              A document is a written or digital file that records information,
              data, or ideas. It can take various forms, such as a report,
              letter, proposal, article, or presentation,
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-5">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                    activeTab2 === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab2(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6">{renderTabContent()}</div>
          </div>
        </div>
        <div className="w-3/4">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.title}
                </h1>
                <p className="text-lg text-gray-600">{project.organization}</p>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <IoSettingsOutline size={20} />
              </button>
            </div>
          </div>

          {/* Project Info Section */}
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="mb-4 flex items-center gap-3">
                  <LuUserRound className="text-gray-500 w-5 h-5" />
                  <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                  <p className="ml-auto text-gray-900">Uchenna Okenwa</p>
                </div>
                <div className="mb-4 flex items-center gap-3">
                  <LuCalendar className="text-gray-500 w-5 h-5" />
                  <h3 className="text-sm font-medium text-gray-500">
                    Timeline
                  </h3>
                  <p className="ml-auto text-gray-900">
                    {project.startDate} - {project.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <PiSpinner className="text-gray-500 w-5 h-5" />
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span
                    className={`ml-auto p-1 px-3 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : project.status === "In progress"
                      ? "bg-[#F1E6D4] text-[#B78026]"
                      : "bg-[#FB002B1A] text-[#FB002B]"
                  }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Project Team
                  </h3>
                  <div className="flex -space-x-2">
                    {project.projectTeam?.map((member, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 text-sm font-medium ring-2 ring-white"
                      >
                        {member.substring(0, 2)}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Client Team
                  </h3>
                  <div className="flex -space-x-2">
                    {project.clientTeam?.map((member, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 text-sm font-medium ring-2 ring-white"
                      >
                        {member.substring(0, 2)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Progress */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Phase: <span className="text-gray-900">Pre travel</span>
                </h3>
                <span className="text-sm font-semibold text-gray-900">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                32 days to completion
              </p>
            </div>

            {/* Tabs Section */}
            <div className="border rounded-lg">
              <ViewToggle
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                options={[
                  { value: "task", label: "Tasks" },
                  { value: "notes", label: "Notes" },
                  { value: "activity", label: "Activity" },
                ]}
              />

              <div className="p-4">
                {/* Tasks Tab */}
                {activeTab === "task" && (
                  <div className="space-y-4">
                    {tasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No tasks yet. Add your first task!
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`mt-1 p-1 rounded-full ${
                              task.completed
                                ? "text-green-500"
                                : "text-gray-300 hover:text-gray-400"
                            }`}
                          >
                            {task.completed ? (
                              <MdCheckBox size={22} />
                            ) : (
                              <MdCheckBoxOutlineBlank size={22} />
                            )}
                          </button>
                          <div className="flex-1">
                            <h4
                              className={`text-lg font-medium ${
                                task.completed
                                  ? "line-through text-gray-400"
                                  : "text-gray-800"
                              }`}
                            >
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-gray-600 mt-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-4 mt-3">
                              {task.dueDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <LuCalendar size={16} />
                                  <span>
                                    Due:{" "}
                                    {new Date(
                                      task.dueDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {task.assignedTo && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <LuUserRound size={16} />
                                  <span>{task.assignedTo}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === "notes" && (
                  <div className="space-y-4">
                    {notes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No notes yet. Add your first note!
                      </div>
                    ) : (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex items-start gap-3">
                            <RiStickyNoteLine className="mt-1 text-gray-400 text-xl" />
                            <div className="flex-1">
                              <p className="text-gray-800 whitespace-pre-wrap">
                                {note.content}
                              </p>
                              <div className="flex justify-between mt-3 text-sm text-gray-500">
                                <span>{note.createdBy}</span>
                                <span>
                                  {new Date(note.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === "activity" && (
                  <div className="space-y-4">
                    {activities.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No activity yet.
                      </div>
                    ) : (
                      activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-4 border-b last:border-b-0"
                        >
                          <div className="p-2 bg-gray-100 rounded-full">
                            <BsActivity className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-800">
                                {activity.action}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {new Date(activity.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">
                              {activity.details}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              by {activity.user}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
