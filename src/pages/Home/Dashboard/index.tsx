import React from "react";
import { DashboardHeader } from "./components/main-header";
import ProjectReport from "./project-report";
// import ProjectStatus from "./project-status";
import Loader from "@/components/ui/loader";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "./get-dashboard-data";
import MostRecentProject from "./most-recent-projects";
import TaskReport from "./task-report";
import TopClient from "./top-client";
import TopPipeline from "./top-pipeline";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    projectCards,
    taskReportData,
    mostRecentProjectsData,
    topClientData,
    topPipelineData,
    isLoading,
    error,
  } = useDashboardData();

  const handleViewMoreProjectReport = () => {
    navigate("/projects");
  };
  const handleViewMoreTasks = () => {
    navigate("/task");
  };
  const handleViewMoreTopClient = () => {
    navigate("/contact");
  };
  const handleViewMoreTopPipeline = () => {
    navigate("/admin?selectedTab=journey");
  };

  if (isLoading) {
    return (
      <div className="mx-3 sm:mx-4 md:mx-6 my-2">
        <DashboardHeader />
        <div className="min-h-[calc(100vh-70px)] flex items-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-3 sm:mx-4 md:mx-6 my-2">
        <DashboardHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading dashboard data. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-3 sm:mx-4 md:mx-6 my-2">
        <DashboardHeader />
        <div className="bg-white rounded-[6px] border border-[#0000001A] px-4 pt-2">
          <ProjectReport cards={projectCards} onViewMore={handleViewMoreProjectReport} />
          {/* <ProjectStatus projects={projectsData} /> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2 flex flex-col h-full">
            <MostRecentProject projects={mostRecentProjectsData} />
          </div>
          <div className="md:col-span-1 flex flex-col h-full">
            <TaskReport
              // totalTasks={taskReportData.totalTasks}
              completedTasks={taskReportData.completedTasks}
              inProgressTasks={taskReportData.inProgressTasks}
              overdueTasks={taskReportData.overdueTasks}
              pendingTasks={taskReportData.pendingTasks ?? 0}
              onViewMore={handleViewMoreTasks}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="md:col-span-1 flex flex-col h-full">
            <TopClient clients={topClientData} onViewMore={handleViewMoreTopClient} />
          </div>
          <div className="md:col-span-1 flex flex-col h-full">
            <TopPipeline
              pipelines={topPipelineData}
              onViewMore={handleViewMoreTopPipeline}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
