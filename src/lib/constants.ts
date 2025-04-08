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
  5. Tasks
  6. Documents
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
};

export const PAGES = {
  FORGET_PASSWORD_SUCCESS: "/forgot-password/success",
};
