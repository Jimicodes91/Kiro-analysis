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
  SEND_CONSULTANT_INVITE: "auth/send-consultant-invite",
  COMPLETE_REGISTRATION: "auth/complete-registration",
  ADD_CLIENT: "auth/add-client",

  // Company Endpoints
  CREATE_COMPANY: "company/create",

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
  */

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
  GET_ALL_PROJECT_TASKS: (projectId: string) => `projects/${projectId}/tasks`,
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
    `projects/${projectId}/document-requestS`,
};

// for GET requests
export const QUERYKEYS = {
  // Auth Query keys
  VERIFY_EMAIL: "VERIFY_EMAIL",

  // User Endpoints
  GET_USER: "GET_USER",

  // 1. Project Types
  GET_ALL_PROJECT_TYPES: "GET_ALL_PROJECT_TYPES",
  GET_PROJECT_TYPE_DETAILS: "GET_PROJECT_TYPE_DETAILS",

  // 2. Milestones
  GET_ALL_PROJECT_TYPE_MILESTONES: "GET_ALL_PROJECT_TYPE_MILESTONES",
  GET_MILESTONE_DETAILS: "GET_MILESTONE_DETAILS",

  // 3. Events
  GET_ALL_PROJECT_EVENTS: "GET_ALL_PROJECT_EVENTS",
  GET_EVENT_DETAILS: "GET_EVENT_DETAILS",

  // 4. Notes
  GET_ALL_PROJECT_NOTES: "GET_ALL_PROJECT_NOTES",
  GET_NOTE_DETAILS: "GET_NOTE_DETAILS",

  // 4.1 Notes => Comments
  GET_NOTE_COMMENTS: "GET_NOTE_COMMENTS",

  // 5. Tasks
  GET_ALL_PROJECT_TASKS: "GET_ALL_PROJECT_TASKS",
  GET_TASK_DETAILS: "GET_TASK_DETAILS",

  // 6. Documents
  GET_ALL_PROJECT_DOCUMENTS: "GET_ALL_PROJECT_DOCUMENTS",
  GET_DOCUMENT_DETAILS: "GET_DOCUMENT_DETAILS",
};

export const PAGES = {
  FORGET_PASSWORD_SUCCESS: "/forgot-password/success",
};
