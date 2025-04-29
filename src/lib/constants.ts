import { IconProps, Icons } from "@/components/ui/icons";
import { JSX } from "react";

export type UserType = "ADMIN" | "CLIENT";

export type DashboardLinkType = {
  title: string;
  icon: (props: IconProps) => JSX.Element;
  path: string;
  exact?: boolean;
};

const universalRoutes = [
  {
    title: "Home",
    icon: Icons.dashboard,
    path: "/home",
    exact: true,
  },
  {
    title: "Projects",
    icon: Icons.project,
    path: "/projects",
  },
  {
    title: "Client",
    icon: Icons.users,
    path: "/client",
  },
  {
    title: "Event",
    icon: Icons.event,
    path: "/event",
  },
  {
    title: "Finance",
    icon: Icons.coins,
    path: "/finance",
  },
];

export const topNavData: Record<UserType, DashboardLinkType[]> = {
  CLIENT: [...universalRoutes],
  ADMIN: [
    ...universalRoutes,
    {
      title: "Admin",
      icon: Icons.admin,
      path: "/admin",
    },
  ],
};

export enum ProjectStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  BLOCKED = "blocked",
  COMPLETED = "completed",
}

export const ENDPOINTS = {
  // Auth Endpoint
  ADMIN_SIGNUP: "auth/admin-signup",
  VERIFY_EMAIL: (token: string) => `auth/verify?token=${token}`,
  RESEND_VERIFICATION_EMAIL: "auth/resend-verification",
  FORGOT_PASSWORD: "auth/forgot-password",
  RESET_PASSWORD: "auth/reset-password",
  UPDATE_PASSWORD: "auth/update-password",
  AUTH_LOGIN: "auth/login",
  COMPANY_ADMIN_SIGNUP: "auth/company-admin-signup",
  SEND_CONSULTANT_INVITE: "auth/send-invite",
  COMPLETE_REGISTRATION: "auth/complete-registration",
  ADD_CLIENT: "auth/add-client",

  // Admin Endpoints
  GET_DASHBOARD_DETAILS: "admin/dashboard",
  GET_ALL_COMPANIES: "admin/companies",
  GET_COMPANY_DETAILS: (companyId: string) => `admin/companies/${companyId}`,
  UPDATE_COMPANY_STATUS: (companyId: string) => `admin/companies/${companyId}/status`,
  SUBSCRIBE_COMPANY: (companyId: string) => `admin/companies/${companyId}/subscribe`,
  CANCEL_COMPANY_SUBSCRIPTION: (companyId: string) =>
    `admin/companies/${companyId}/cancel-subscription`,
  RENEW_COMPANY_SUBSCRIPTION: (companyId: string) =>
    `admin/companies/${companyId}/renew-subscription`,
  ADD_SYSTEM_ADMIN: "admin/sysadmins",
  DEACTIVATE_SYSTEM_ADMIN: (adminId: string) => `admin/sysadmins/${adminId}/deactivate`,
  GET_ACTIVE_ORGANIZATIONS: "admin/active-organization",
  GET_INACTIVE_ORGANIZATIONS: "admin/inactive-organization",
  GET_ALL_USERS: `admin/all`,
  GET_ACTIVE_USERS: `admin/active-users`,
  GET_ALL_ADMINS: `admin/all-admin`,

  // Company Endpoints
  CREATE_COMPANY: (userId: string) => `company/create/${userId}`,

  // Company Admin Endpoints
  GET_COMPANY_USERS: (companyId: string) => `admin/companies/${companyId}/users`,
  UPDATE_COMPANY_USER_STATUS: (companyId: string) => `admin/users/${companyId}/status`,

  // User Endpoints
  GET_USER: (userId: string) => `user/${userId}`,
  UPDATE_PROFILE: (userId: string) => `user/profile/${userId}`,

  /* 
  Project Module Collection
    1. Project Types
    2. Milestones
    3. Events
    4. Notes
      1. Comments
    5. Tasks
    6. Documents
      1. Document Request
    7. Project Members
    8. Project Settings
    9. Document Types
    10. Event Types
    11. Task Types
    12. Activity Logs
    13. Project Forms
  */
  // 0. Project Module Collection
  CREATE_PROJECT: "projects",
  GET_ALL_PROJECTS: (projectTypeId?: string, status?: ProjectStatus) =>
    `projects${projectTypeId ? `?project_type_id=${projectTypeId}` : ""}${status ? `?status=${status}` : ""}`,
  GET_PROJECT_DETAILS: (projectId: string) => `projects/${projectId}`,
  UPDATE_PROJECT_DETAILS: (projectId: string) => `projects/${projectId}`,
  UPDATE_PROJECT_MILESTONE: (projectId: string) => `projects/${projectId}`,

  // 1. Project Types
  GET_ALL_PROJECT_TYPES: "projects/types",
  GET_PROJECT_TYPE_DETAILS: (projectTypeId: string) => `projects/types/${projectTypeId}`,
  UPDATE_PROJECT_TYPE_DETAILS: (projectTypeId: string) =>
    `projects/types/${projectTypeId}`,
  CREATE_PROJECT_TYPE: "projects/types",

  // 2. Milestones
  CREATE_MILESTONE: "projects/types/milestones",
  GET_ALL_PROJECT_TYPE_MILESTONES: (projectTypeId: string) =>
    `projects/types/${projectTypeId}/milestones`,
  GET_MILESTONE_DETAILS: (projectTypeId: string, milestoneId: string) =>
    `projects/types/${projectTypeId}/milestones/${milestoneId}`,
  UPDATE_MILESTONE_DETAILS: (milestoneId: string) =>
    `projects/types/milestones/${milestoneId}`,

  // 3. Events
  CREATE_EVENT: (projectId: string) => `projects/${projectId}/events`,
  GET_ALL_PROJECT_EVENTS: (projectId: string) => `projects/${projectId}/events`,
  UPDATE_PROJECT_EVENT: (projectId: string, eventId: string) =>
    `projects/${projectId}/events/${eventId}`,
  GET_EVENT_DETAILS: (projectId: string, eventId: string) =>
    `projects/${projectId}/events/${eventId}`,
  DELETE_EVENT: (projectId: string, eventId: string) =>
    `projects/${projectId}/events/${eventId}`,

  // 4. Notes
  CREATE_NOTE: (projectId: string) => `projects/${projectId}/notes`,
  GET_ALL_PROJECT_NOTES: (projectId: string) => `projects/${projectId}/notes`,
  GET_NOTE_DETAILS: (projectId: string, noteId: string) =>
    `projects/${projectId}/notes/${noteId}`,
  TOGGLE_NOTE_PIN_STATE: (projectId: string, noteId: string) =>
    `projects/${projectId}/notes/${noteId}/pin`,

  // 4.1 Notes => Comments
  ADD_NOTE_COMMENT: (projectId: string, noteId: string) =>
    `projects/${projectId}/notes/${noteId}/comments`,
  GET_NOTE_COMMENTS: (projectId: string, noteId: string) =>
    `projects/${projectId}/notes/${noteId}/comments`,
  DELETE_NOTE_COMMENT: (projectId: string, noteId: string, commentId: string) =>
    `projects/${projectId}/notes/${noteId}/comments/${commentId}`,

  // 5. Tasks
  CREATE_TASK: (projectId: string) => `projects/${projectId}/tasks`,
  GET_ALL_PROJECT_TASKS: (projectId: string) => `projects/tasks?project_id=${projectId}`,
  GET_TASK_DETAILS: (projectId: string, taskId: string) =>
    `projects/${projectId}/tasks/${taskId}`,
  UPDATE_TASK_DETAILS: (projectId: string, taskId: string) =>
    `projects/${projectId}/tasks/${taskId}`,
  DELETE_TASK: (projectId: string, taskId: string) =>
    `projects/${projectId}/tasks/${taskId}`,
  DELETE_TASK_ATTACHMENT: (projectId: string, taskId: string, attachmentId: string) =>
    `projects/${projectId}/tasks/${taskId}/attachments/${attachmentId}`,

  // 6. Documents
  UPLOAD_DOCUMENT: (projectId: string) => `projects/${projectId}/documents`,
  GET_ALL_PROJECT_DOCUMENTS: (projectId: string) => `projects/${projectId}/documents`,
  GET_DOCUMENT_DETAILS: (projectId: string, documentId: string) =>
    `projects/${projectId}/documents/${documentId}`,
  UPDATE_DOCUMENT_DETAILS: (projectId: string, documentId: string) =>
    `projects/${projectId}/documents/${documentId}`,
  DELETE_DOCUMENT: (projectId: string, documentId: string) =>
    `projects/${projectId}/documents/${documentId}`,
  DELETE_DOCUMENT_ATTACHMENT: (
    projectId: string,
    documentId: string,
    attachmentId: string
  ) => `projects/${projectId}/documents/${documentId}/attachments/${attachmentId}`,
  UPDATE_DOCUMENT_ATTACHMENT: (
    projectId: string,
    documentId: string,
    attachmentId: string
  ) => `projects/${projectId}/documents/${documentId}/attachments/${attachmentId}`,

  // 6.1 Document Request
  CREATE_DOCUMENT_REQUEST: (projectId: string) =>
    `projects/${projectId}/document-requests`,

  // 7. Project Members
  ADD_PROJECT_MEMBER: (projectId: string) => `projects/${projectId}/members`,
  GET_PROJECT_MEMBERS: (projectId: string) => `projects/${projectId}/members`,
  REMOVE_PROJECT_MEMBER: (projectId: string, memberId: string) =>
    `projects/${projectId}/members/${memberId}`,

  // 8. Project Settings
  SET_PROJECT_SETTINGS: (projectId: string) => `settings/projects/${projectId}`,
  GET_PROJECT_SETTINGS: (projectId: string) => `settings/projects/${projectId}`,

  // 9. Document Types
  CREATE_DOCUMENT_TYPE: `metadata/type/documents`,
  GET_DOCUMENT_TYPES: `metadata/type/documents`,

  // 10. Event Types
  CREATE_EVENT_TYPE: "metadata/type/events",
  GET_EVENT_TYPES: "metadata/type/events",

  // 11. Task Types
  CREATE_TASK_TYPE: "metadata/type/tasks",
  GET_TASK_TYPES: "metadata/type/tasks",

  // 12. Activity Logs
  GET_AUDIT_TRAIL: (projectId: string, page = 1, limit = 20) =>
    `audit-trail/projects?project_id=${projectId}&page=${page}&limit=${limit}`,

  // 13. Project Forms
  GET_PROJECT_FORMS: `projects/forms`,
  GET_PROJECT_FORM_FIELDS: "projects/forms/fields",
  ADD_FORM_FIELDS: `projects/forms/fields`,
  TOGGLE_PROJECT_FIELD_REQUIREMENT: (fieldId: string) =>
    `projects/forms/fields/${fieldId}/requirement`,
};

// for GET requests
export const QUERYKEYS = {
  // Auth Query keys
  VERIFY_EMAIL: "VERIFY_EMAIL",

  // Admin Query keys
  GET_DASHBOARD_DETAILS: "GET_DASHBOARD_DETAILS",
  GET_ALL_COMPANIES: "GET_ALL_COMPANIES",
  GET_COMPANY_DETAILS: "GET_COMPANY_DETAILS",
  GET_ACTIVE_ORGANIZATIONS: "GET_ACTIVE_ORGANIZATIONS",
  GET_INACTIVE_ORGANIZATIONS: "GET_INACTIVE_ORGANIZATIONS",
  GET_ALL_USERS: "GET_ALL_USERS",
  GET_ACTIVE_USERS: "GET_ACTIVE_USERS",
  GET_ALL_ADMINS: "GET_ALL_ADMINS",

  // Company Admin Endpoints
  GET_COMPANY_USERS: "GET_COMPANY_USERS",

  // User Query keys
  GET_USER: "GET_USER",

  // 0. Project Module Collection
  GET_ALL_PROJECTS: "GET_ALL_PROJECTS",
  GET_PROJECT_DETAILS: "GET_PROJECT_DETAILS",
  UPDATE_PROJECT_MILESTONE: "UPDATE_PROJECT_MILESTONE",

  // 1. Project Types Query keys
  GET_ALL_PROJECT_TYPES: "GET_ALL_PROJECT_TYPES",
  GET_PROJECT_TYPE_DETAILS: "GET_PROJECT_TYPE_DETAILS",

  // 2. Milestones Query keys
  GET_ALL_PROJECT_TYPE_MILESTONES: "GET_ALL_PROJECT_TYPE_MILESTONES",
  GET_MILESTONE_DETAILS: "GET_MILESTONE_DETAILS",

  // 3. Events Query keys
  GET_ALL_PROJECT_EVENTS: "GET_ALL_PROJECT_EVENTS",
  GET_EVENT_DETAILS: "GET_EVENT_DETAILS",

  // 4. Notes Query keys
  GET_ALL_PROJECT_NOTES: "GET_ALL_PROJECT_NOTES",
  GET_NOTE_DETAILS: "GET_NOTE_DETAILS",

  // 4.1 Notes => Comments Query keys
  GET_NOTE_COMMENTS: "GET_NOTE_COMMENTS",

  // 5. Tasks Query keys
  GET_ALL_PROJECT_TASKS: "GET_ALL_PROJECT_TASKS",
  GET_TASK_DETAILS: "GET_TASK_DETAILS",

  // 6. Documents Query keys
  GET_ALL_PROJECT_DOCUMENTS: "GET_ALL_PROJECT_DOCUMENTS",
  GET_DOCUMENT_DETAILS: "GET_DOCUMENT_DETAILS",

  // 7. Project Members Query keys
  GET_PROJECT_MEMBERS: "GET_PROJECT_MEMBERS",

  // 8. Project Settings Query keys
  GET_PROJECT_SETTINGS: "GET_PROJECT_SETTINGS",

  // 9. Document Types Query keys
  GET_DOCUMENT_TYPES: "GET_DOCUMENT_TYPES",

  // 10. Event Types Query keys
  GET_EVENT_TYPES: "GET_EVENT_TYPES",

  // 11. Task Types Query keys
  GET_TASK_TYPES: "GET_TASK_TYPES",

  // 12. Activity Logs Query keys
  GET_AUDIT_TRAIL: "GET_AUDIT_TRAIL",

  // 13. Project Forms
  GET_PROJECT_FORMS: "GET_PROJECT_FORMS",
  GET_PROJECT_FORM_FIELDS: "GET_PROJECT_FORM_FIELDS",
};

export const PAGES = {
  // auth pages
  LOGIN_PAGE: "/",
  REGISTER_PAGE: "/register",
  FORGOT_PASSWORD_PAGE: "/forgot-password",
  RESET_PASSWORD_PAGE: "/reset-password",
  ADMIN_PAGE: "/admin",
  PROJECT_PAGE: "/projects",
  ONBOARDING_PAGE: "/onboarding",
  PROJECT_CREATE_PAGE: "/projects/create",
};

export const industryList = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "entertainment", label: "Entertainment" },
];

export const companySizeList = [
  { value: "1-10", label: "1-10 Employees" },
  { value: "11-50", label: "11-50 Employees" },
  { value: "51-100", label: "51-100 Employees" },
  { value: "101-250", label: "101-250 Employees" },
  { value: "251-500", label: "251-500 Employees" },
  { value: "500+", label: "500+ Employees" },
];

export const countryList = [
  { value: "Nigeria", label: "Nigeria" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
];

// Define a type for the state options
type StateOption = { value: string; label: string };

// Define a type for the country-states mapping
export type CountryStatesMap = {
  [key in "Nigeria" | "usa" | "uk" | "ca"]: StateOption[];
};

// Predefined country-state mappings
export const COUNTRY_STATES: CountryStatesMap = {
  Nigeria: [
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "ibadan", label: "Ibadan" },
    { value: "kano", label: "Kano" },
  ],
  usa: [
    { value: "ny", label: "New York" },
    { value: "ca", label: "California" },
    { value: "tx", label: "Texas" },
    { value: "fl", label: "Florida" },
  ],
  uk: [
    { value: "london", label: "London" },
    { value: "manchester", label: "Manchester" },
    { value: "birmingham", label: "Birmingham" },
    { value: "liverpool", label: "Liverpool" },
  ],
  ca: [
    { value: "ontario", label: "Ontario" },
    { value: "quebec", label: "Quebec" },
    { value: "bc", label: "British Columbia" },
    { value: "alberta", label: "Alberta" },
  ],
};
