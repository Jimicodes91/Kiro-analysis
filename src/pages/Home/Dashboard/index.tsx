import React from "react";
import ClientInteraction from "./client-interaction";
import { DashboardHeader } from "./components/main-header";
import DelayedProject from "./delayed-project";
import ProjectReport from "./project-report";
import ProjectStatus from "./project-status";
import TaskReport from "./task-report";
import UserPerformance from "./user-performance";

const Dashboard: React.FC = () => {
  interface CardDetail {
    title: string;
    count: number;
    increase?: number;
    status?: string;
  }

  const projectCards: CardDetail[] = [
    { title: "Projects", count: 250, increase: 10 },
    { title: "Completed", count: 50 },
    { title: "Inprogress", count: 50 },
    { title: "Overdue", count: 50 },
  ];

  const projectsData = [
    {
      id: "1",
      name: "ElevatePro Digital",
      company: "Stellar Solutions Inc.",
      status: "in progress" as const,
      startDate: "02 Nov 2023",
      milestone: "Onboarding",
      progress: 67,
    },
    {
      id: "2",
      name: "ElevatePro Digital",
      company: "Stellar Solutions Inc.",
      status: "in progress" as const,
      startDate: "02 Nov 2023",
      milestone: "Onboarding",
      progress: 67,
    },
    {
      id: "3",
      name: "ElevatePro Digital",
      company: "Stellar Solutions Inc.",
      status: "in progress" as const,
      startDate: "02 Nov 2023",
      milestone: "Onboarding",
      progress: 67,
    },
  ];

  const taskReportData = {
    totalTasks: 50,
    completedTasks: 12,
    inProgressTasks: 4,
    overdueTasks: 24,
  };

  const userPerformanceData = [
    {
      id: "1",
      name: "Jessica Parker",
      completedTasks: 8,
      callsMade: 12,
      tasksClosed: 7,
    },
    {
      id: "2",
      name: "Jessica Parker",
      completedTasks: 8,
      callsMade: 12,
      tasksClosed: 7,
    },
    {
      id: "3",
      name: "Jessica Parker",
      completedTasks: 8,
      callsMade: 12,
      tasksClosed: 7,
    },
    {
      id: "4",
      name: "Jessica Parker",
      completedTasks: 8,
      callsMade: 12,
      tasksClosed: 7,
    },
  ];

  const clientInteractionData = [
    {
      id: "1",
      name: "Jessica Parker",
      pointOfContact: "Call",
      purpose: "Document inquiry",
      date: "02 Nov 2023",
    },
    {
      id: "2",
      name: "Jessica Parker",
      pointOfContact: "Meeting",
      purpose: "Document inquiry",
      date: "02 Nov 2023",
    },
    {
      id: "3",
      name: "Jessica Parker",
      pointOfContact: "Email",
      purpose: "Document inquiry",
      date: "02 Nov 2023",
    },
  ];

  const delayedProjectsData = [
    {
      id: "1",
      name: "ElevatePro Digital Transformation",
      company: "Stellar Solutions Inc.",
      status: "overdue",
    },
    {
      id: "2",
      name: "ElevatePro Digital Transformation",
      company: "Stellar Solutions Inc.",
      status: "overdue",
    },
    {
      id: "3",
      name: "ElevatePro Digital Transformation",
      company: "Stellar Solutions Inc.",
      status: "overdue",
    },
  ];

  const handleViewMoreProjectReport = () => {
    console.log("View more project report clicked");
  };
  const handleViewMoreTasks = () => {
    console.log("View more tasks clicked");
  };
  const handleViewMorePerformance = () => {
    console.log("View more performance clicked");
  };
  const handleViewMoreClientInteraction = () => {
    console.log("View more client interaction clicked");
  };
  const handleViewMoreDelayedProjects = () => {
    console.log("View more delayed project clicked");
  };

  return (
    <div>
      <div className="mx-6 my-2">
        <DashboardHeader />
        <div className="bg-white rounded-[6px] border border-[#0000001A] px-4 pb-4 pt-2">
          <ProjectReport cards={projectCards} onViewMore={handleViewMoreProjectReport} />
          <ProjectStatus projects={projectsData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-1 flex flex-col h-full">
            <TaskReport
              totalTasks={taskReportData.totalTasks}
              completedTasks={taskReportData.completedTasks}
              inProgressTasks={taskReportData.inProgressTasks}
              overdueTasks={taskReportData.overdueTasks}
              onViewMore={handleViewMoreTasks}
            />
          </div>
          <div className="md:col-span-2 flex flex-col h-full">
            <UserPerformance
              users={userPerformanceData}
              onViewMore={handleViewMorePerformance}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-4">
          <div className="md:col-span-4 flex flex-col h-full">
            <ClientInteraction
              clients={clientInteractionData}
              onViewMore={handleViewMoreClientInteraction}
            />
          </div>
          <div className="md:col-span-3 flex flex-col h-full">
            <DelayedProject
              delayedProjects={delayedProjectsData}
              onViewMore={handleViewMoreDelayedProjects}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
