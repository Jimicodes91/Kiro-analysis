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
  errors?: Record<string, unknown>;

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
  status: string;
  start_date: string;
  end_date: string;
  is_visible_to_client: number;
  assignee: string[];
  document: Document[];
}

export interface Document {
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
