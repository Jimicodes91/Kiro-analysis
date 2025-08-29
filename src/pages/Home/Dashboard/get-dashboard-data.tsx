import useGetDashboardMetrics from "@/hooks/home/use-get-dashboard-metrics";
import { useMemo } from "react";

// Define the transformed data types
interface TransformedDashboardData {
  projectCards: Array<{
    title: string;
    count: number;
    increase?: number;
  }>;
  taskReportData: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    pendingTasks: number;
  };
  mostRecentProjectsData: Array<{
    id: string;
    name: string;
    company: string;
    status: "not_started" | "pending" | "in_progress" | "completed";
    expectedEndDate: string;
  }>;
  topClientData: Array<{
    id: string;
    name: string;
    company: string;
    noOfProject: number;
    activeProject: number;
  }>;
  topPipelineData: Array<{
    id: string;
    name: string;
    noOfProject: number;
    activeProject: number;
    avCompletionDays: number;
  }>;
}

export const useDashboardData = () => {
  const { data: apiResponse, isLoading, error } = useGetDashboardMetrics();

  const transformedData = useMemo<TransformedDashboardData>(() => {
    if (!apiResponse?.data?.data) {
      return {
        projectCards: [
          { title: "Projects", count: 0, increase: 0 },
          { title: "Completed", count: 0 },
          { title: "Inprogress", count: 0 },
        ],
        taskReportData: {
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          overdueTasks: 0,
          pendingTasks: 0,
        },
        mostRecentProjectsData: [],
        topClientData: [],
        topPipelineData: [],
      };
    }

    const {
      data: { data },
    } = apiResponse;

    const projectCards = [
      {
        title: "Projects",
        count: data.project_report.total,
        increase: data.project_report.percentage_increase,
      },
      {
        title: "Completed",
        count: data.project_report.completed,
      },
      {
        title: "Inprogress",
        count: data.project_report.in_progress,
      },
    ];

    const taskReportData = {
      totalTasks: data.task_report.total,
      completedTasks: data.task_report.completed,
      inProgressTasks: data.task_report.in_progress,
      overdueTasks: data.task_report.overdue,
      pendingTasks: data.task_report.pending,
    };

    const mostRecentProjectsData = data.recent_projects.map((project) => ({
      id: project.id,
      name: project.name,
      company: project.company,
      status: project.status as "not_started" | "pending" | "in_progress" | "completed",
      expectedEndDate: project.expected_end_date,
    }));

    const topClientData = data.top_clients.map((client) => ({
      id: client.client_id,
      name: client.client_name,
      company: client.company_name,
      noOfProject: client.project_count,
      activeProject: client.active_project_count,
    }));

    const topPipelineData = data.top_pipeline.map((pipeline) => ({
      id: pipeline.id,
      name: pipeline.name,
      noOfProject: pipeline.project_count,
      activeProject: pipeline.active_project_count,
      avCompletionDays: pipeline.completion_days,
    }));

    return {
      projectCards,
      taskReportData,
      mostRecentProjectsData,
      topClientData,
      topPipelineData,
    };
  }, [apiResponse]);

  return {
    ...transformedData,
    isLoading,
    error,
  };
};
