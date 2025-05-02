import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { ProjectStatus } from "@/lib/constants";
import { QueryFunction, QueryKey } from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, Method } from "axios";

export type CustomMethod = "get" | "put" | "delete" | "post" | "patch";

export interface SecureRequestProps<T = Record<string, unknown>> {
  method?: Method;
  url: string;
  body?: Record<string, unknown>;
  headers?: AxiosRequestHeaders;
  endpoint?: string;
  queryKey?: string | string[] | number[];
  showSuccessToast?: boolean;
  showFailureToast?: boolean;
  message?: string;
  queryFn?: QueryFunction<PylottResponseType<T>, QueryKey>;
  extraConfig?: AxiosRequestConfig<unknown> | undefined;
}

export interface RequestResponse<T = Record<string, unknown>> {
  queryFn?: QueryFunction<PylottResponseType<T>, QueryKey>;
}

export type PylottResponseType<D = Record<string, unknown>> = AxiosResponse<
  CredentialsServerResponseModel<D> & { message: string }
>;

export type CredentialsServerResponseModel<T> = T;

export interface ResponseErrorType {
  message: string;
  name: string;
  data: { errors?: string[] };

  response: {
    data: {
      response_message: string;
      status: number;
      statusCode: number;
      message: string;
      details: string[];
      errors?: Record<string, unknown>;
      source: string;
    };
  };
}

export interface TaskDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  project_id: string;
  company_id: string;
  author_id: string;
  assignee_id?: string;
  name: string;
  description: string;
  status: "in_progress" | "completed";
  start_date: string;
  end_date: string;
  is_visible_to_client: number;
  assignees: Author[];
  document: IDocument[];
}

export interface IDocument {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  company_id: string;
  project_id: string;
  document_type_id: string;
  name: string;
  task_id: string;
  note_id: string;
  type: string;
  description?: string;
  is_visible_to_client: number;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  document_id: string;
  media_url: string;
}

export interface EventDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
  project_id: string;
  company_id: string;
  event_type_id: string;
  created_by: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  description: string;
  venue: string;
  invites: string[];
  provider_identifier: unknown;
  is_visible_to_client: number;
  date: string;
  is_creator: boolean;
  is_attendee: boolean;
  user_response: unknown;
  attendance_stats: AttendanceStats;
}

export interface AttendanceStats {
  total: number;
  accepted: number;
  declined: number;
  tentative: number;
  no_response: number;
}

export interface NoteDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  project_id: string;
  note_id: string;
  author_id: string;
  content: string;
  author: Author;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CommentDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  project_id: string;
  note_id: string;
  author_id: string;
  content: string;
  author: Author;
}

export interface Member {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  company_id: string;
  project_id: string;
  user_id: string;
  is_visible_to_client: number;
  added_by: string;
  users: User[];
  creator: Creator;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Creator {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Setting {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  project_id: string;
  company_id: string;
  client_can_view_task: number;
  client_can_view_notes: number;
  client_can_view_documents: number;
  client_can_view_activity: number;
}

export interface DocumentTypeDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  company_id: string;
  project_id: string;
  name: string;
  is_system: number;
  type: string;
  description: string;
}

export interface EventTypeDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  company_id: string;
  project_id: string;
  name: string;
  is_system: number;
  type: string;
  description: string;
}

export interface TaskTypeDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  company_id: string;
  project_id: string;
  name: string;
  is_system: number;
  type: string;
  description: string;
}

export interface Activity {
  trails: Trail[];
  pagination: Pagination;
}

export interface Trail {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  company_id: string;
  user_id: string;
  project_id: string;
  name: string;
  description: string;
  entity: Entity;
  author: Author;
}

export interface Entity {
  id: string;
  description: string;
  name: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProjectDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  client_id?: string;
  company_id: string;
  consultant_id?: string;
  milestone_id?: string;
  project_type_id: string;
  status: `${ProjectStatus}`;
  name: string;
  start_date: string;
  end_date: string;
  completed_at?: string;
  jurisdiction?: string;
  visa_required?: string;
  package?: string;
  form_data: ProjectFormData;
  documents?: string[];
  project_type: ProjectType;
  custom_fields?: string;
  milestone?: ProjectTypeMilestone;
  client?: string;
  timeline: string;
}

export interface ProjectType {
  id: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  name: string;
  slug: string;
  is_system: number;
}
export interface ProjectFormData {
  end_date: string;
  pipeline: string;
  post_code: string;
  start_date: string;
  description: string;
  nationality: string;
  phone_number: string;
  project_name: string;
  email_address: string;
  project_value: number;
  project_client: string;
  resident_country: string;
  client_organization: string;
}

export interface CustomFields {
  tax_id: string;
  company_name: string;
  articles_file: string[];
  legal_structure: string;
  incorporation_date: string;
}

export interface UserDetails {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  email: string;
  pfp?: string;
  password: string;
  name?: string;
  role: string;
  company_id?: string;
  is_blocked: number;
  is_verified: number;
  timezone?: string;
  language: string;
  currency: string;
  is_active: number;
  last_login?: string;
  verification_token?: string;
  token_expires?: number;
  googleId?: string;
  refresh_token?: string;
  refresh_token_expires?: string;
  password_setup_token?: string;
  login_count: number;
  password_setup_token_expires?: string;
}
export interface ContactDetails {
  id: string;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
  deleted_at: string; // ISO 8601 string
  name: string;
  email: string;
  phone: string;
  organization: string;
  address: string | null;
  active_projects: number;
  total_projects: number;
  no_of_projects: number | null;
  closed_projects: number | null;
  assigne: string | null;
  assigned_to: {
    id: string;
    name: string;
  }[];
}
