export interface Progress {
  days_to_completion: number;
  percentage_complete: number;
}

export interface RecentProject {
  id: string;
  name: string;
  status: string;
  start_date: string;
  expected_end_date: string;
  milestone_id: string;
  milestone_name: string;
  progress: Progress;
  company: string;
}

export interface TopPipeline {
  id: string;
  name: string;
  project_count: number;
  active_project_count: number;
  completion_days: number;
}

export interface TopClient {
  client_id: string;
  client_name: string;
  company_name: string;
  project_count: number;
  active_project_count: number;
}

export interface ProjectReport {
  total: number;
  completed: number;
  in_progress: number;
  current_month_count: number;
  last_month_count: number;
  percentage_increase: number;
}

export interface TaskReport {
  total: number;
  completed: number;
  in_progress: number;
  overdue: number;
}

export interface DashboardData {
  project_report: ProjectReport;
  task_report: TaskReport;
  recent_projects: RecentProject[];
  top_pipeline: TopPipeline[];
  top_clients: TopClient[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
