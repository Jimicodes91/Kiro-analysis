export interface AssignTo {
  value: string | number;
  label: string;
}

export interface Task {
  id: number;
  taskName: string;
  projectName?: string;
  clientName?: string;
  company?: string;
  projectType: string;
  taskType?: string;
  status: "completed" | "in_progress" | "pending";
  startDate: string;
  endDate: string;
  description: string;
  assignTo?: AssignTo[];
  visibleToClient: boolean;
  assignee: string[];
  attachments?: string[];
}

export interface TaskFormData {
  id?: number;
  taskName: string;
  taskType: string;
  projectType: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  assignTo?: AssignTo[];
  attachments?: string[];
  visibleToClient: boolean;
}
