export interface FormLink {
  id: string;
  form_url: string;
  display_name: string;
  project_type_id: string | null;
  milestone_id: string | null;
  sort_order: number;
  organization_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface FormLinkResponse {
  id: string;
  form_url: string;
  display_name: string;
  project_type_id: string | null;
  milestone_id: string | null;
  sort_order: number;
  organization_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateFormLinkRequest {
  form_url: string;
  display_name: string;
  project_type_id?: string;
  milestone_id?: string;
  sort_order?: number;
}

export interface UpdateFormLinkRequest {
  form_url?: string;
  display_name?: string;
  project_type_id?: string;
  milestone_id?: string;
  sort_order?: number;
}

export interface NativeFormsSubmission {
  id: string;
  organization_id: string;
  form_link_id: string | null;
  submission_id: string;
  project_id: string | null;
  task_id: string | null;
  client_id: string | null;
  form_url: string;
  display_name: string;
  submitted_data: Record<string, unknown>;
  raw_payload: Record<string, unknown>;
  submitted_at: string;
  created_at: string;
}

export interface SubmissionCheckResponse {
  exists: boolean;
  submitted_at?: string;
}

export interface NativeFormEmbedProps {
  formUrl: string;
  clientId: string;
  projectId: string;
  formLinkId: string;
  onSubmissionComplete?: () => void;
}

export interface ClientJourneyFormsProps {
  projectId: string;
  projectTypeId: string;
  milestoneId: string;
}

export type FormLinkStatus = "not_started" | "completed";
