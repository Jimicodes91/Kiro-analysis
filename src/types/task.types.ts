export interface Attachment {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  document_id: string;
  field_id: string | null;
  media_url: string;
  context: string | null;
}

export interface Document {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company_id: string;
  project_id: string;
  document_type_id: string;
  name: string;
  task_id: string;
  note_id: string | null;
  type: string;
  description: string | null;
  is_visible_to_client: number;
  attachments: Attachment[];
}

export interface Assignee {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface TaskType {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company_id: string;
  project_id: string | null;
  name: string;
  is_system: number;
  type: string;
  description: string;
}

export interface Pipeline {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company_id: string;
  name: string;
  slug: string;
  is_system: number;
}

export interface Company {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project_id: string;
  company_id: string;
  author_id: string;
  task_type_id: string;
  project_type_id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  is_visible_to_client: number;
  assignees: Assignee[];
  document: Document[];
  task_type: TaskType;
  pipeline: Pipeline;
  company: Company;
}
export interface TaskFormData {
  id?: string;
  name: string;
  task_type_id: string;
  project_type_id: string;
  project: string;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  assignees: string[];
  attachments: string[];
  is_visible_to_client: boolean;
}
