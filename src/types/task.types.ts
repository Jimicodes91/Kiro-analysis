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

export interface TaskContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
}

export interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project_id: string | null;
  company_id: string;
  author_id: string;
  task_type_id: string;
  project_type_id: string | null;
  name: string;
  description: string;
  status: "draft" | "sent" | "in_progress" | "completed" | "archived" | "pending";
  start_date: string;
  end_date: string;
  due_date?: string;
  is_visible_to_client: number;
  task_category: TaskCategory;
  required_information?: string[];
  additional_info?: string[];
  assignees: Assignee[];
  client_assignees?: ClientAssignee[];
  client_responses?: ClientResponse[];
  document: Document[];
  task_type: TaskType;
  pipeline: Pipeline;
  company: Company;
  project: {
    id: string;
    name: string;
    client_organization: string;
    clients: Client[];
  } | null;
  // Activity / Pipedrive fields
  contact_id?: string | null;
  contact?: TaskContact | null;
  priority?: string;
  // Lifecycle expansion fields
  signing_status?: SigningSubStatus;
  task_category_type?: TaskCategoryType;
  form_config?: FormConfig;
  comments?: TaskComment[];
  activity_log?: TaskActivityLogEntry[];
}

export enum TaskCategory {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export interface ClientAssignee {
  id: string;
  task_id: string;
  client_id: string;
  project_id: string;
  company_id: string;
  client?: {
    id: string;
    name: string;
    email: string;
    organization?: string;
  };
}

export interface ClientResponse {
  id: string;
  task_id: string;
  client_id: string;
  required_item: string;
  file_url: string | null;
  is_completed: boolean;
  comment: string | null;
  client?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface InternalTaskFormData {
  name?: string;
  description?: string;
  status?: string;
  start_date: string;
  end_date: string;
  assignees: string[];
  attachments?: string[];
  task_type_id?: string;
  project_type_id?: string;
  task_category: TaskCategory.INTERNAL;
  additional_info?: string[];
}

export interface ExternalTaskFormData {
  name: string;
  description?: string;
  end_date: string;
  client_ids: string[];
  required_information: string[];
  task_type_id?: string;
  project_type_id: string;
  task_category: TaskCategory.EXTERNAL;
}

export interface AvailableAssignee {
  id: string;
  name: string;
  email: string;
  role?: string;
  organization?: string;
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

export interface Client {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  company_id: string;
  assigned_to: AssignedTo[];
}

export interface AssignedTo {
  id: string;
  name: string;
}


// ── Task Lifecycle Expansion ──

export enum TaskLifecycleStatus {
  DRAFT = "draft",
  SENT = "sent",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ARCHIVED = "archived",
}

export enum SigningSubStatus {
  SENT = "sent",
  VIEWED = "viewed",
  SIGNED = "signed",
  COMPLETED = "completed",
}

export enum TaskCategoryType {
  SIGNING = "signing",
  INFORMATION_REQUEST = "information_request",
  DOCUMENT_UPLOAD = "document_upload",
  ACTIVITY = "activity",
  MEETING = "meeting",
  TASK = "task",
  FOLLOW_UP = "follow_up",
  MESSAGE = "message",
  REVIEW = "review",
}

export interface TaskComment {
  id: string;
  task_id: string;
  author_id: string;
  content: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  author?: { id: string; name: string; email: string };
}

export interface TaskActivityLogEntry {
  id: string;
  task_id: string;
  action: string;
  previous_value: string | null;
  new_value: string | null;
  user_id: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user?: { id: string; name: string };
}

export interface FormConfig {
  mode: "native" | "external";
  form_id?: string;
  external_url?: string;
}
