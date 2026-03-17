# Requirements Document

## Introduction

The Pylott platform currently lacks a unified workspace signup flow. The frontend SignUp page sends a POST request to `auth/signup` with user details and a workspace name, but no corresponding backend route exists. The existing `company-admin-signup` route only creates a user without a company/workspace, and company creation is a separate authenticated endpoint. This feature bridges that gap by implementing a single `auth/signup` endpoint that atomically creates a user, a workspace (company), seeds default data, sends email verification, and returns a JWT — enabling the frontend to work end-to-end on staging and production.

## Glossary

- **Signup_Endpoint**: The backend HTTP route at `POST /api/v1/auth/signup` that handles workspace signup requests
- **Signup_Service**: The backend service method that orchestrates user creation, workspace creation, default data seeding, and token generation
- **Workspace**: A company entity in the Pylott database representing an organization's isolated environment (maps to the `companies` table)
- **Signing_User**: The person submitting the signup form who becomes the ADMIN of the new workspace
- **Default_Data_Seeder**: The service responsible for inserting default project types (journeys) and task types into a newly created workspace
- **CORS_Config**: The Express CORS middleware configuration in `app.ts` that controls which origins can access the backend API
- **Validation_Middleware**: The Express middleware that validates request body fields before they reach the controller
- **OTP**: A one-time password sent via email for account verification
- **JWT**: A JSON Web Token issued upon successful signup for authenticating subsequent requests

## Requirements

### Requirement 1: Signup Route Registration

**User Story:** As a frontend developer, I want the backend to expose an `auth/signup` route, so that the existing SignUp page can call it without changes.

#### Acceptance Criteria

1. THE Signup_Endpoint SHALL accept POST requests at path `/api/v1/auth/signup`
2. THE Signup_Endpoint SHALL apply the Validation_Middleware before invoking the controller handler
3. THE Signup_Endpoint SHALL be accessible without authentication

### Requirement 2: Request Validation

**User Story:** As a developer, I want the signup request to be validated on the server, so that malformed or incomplete data is rejected before processing.

#### Acceptance Criteria

1. WHEN a request is missing the `email` field, THE Validation_Middleware SHALL return a 400 status with an error message indicating email is required
2. WHEN a request is missing the `password` field, THE Validation_Middleware SHALL return a 400 status with an error message indicating password is required
3. WHEN a request is missing the `name` field, THE Validation_Middleware SHALL return a 400 status with an error message indicating name is required
4. WHEN a request is missing the `workspace_name` field, THE Validation_Middleware SHALL return a 400 status with an error message indicating workspace name is required
5. WHEN the `email` field is not a valid email format, THE Validation_Middleware SHALL return a 400 status with an error message indicating the email is invalid
6. WHEN the `password` field has fewer than 8 characters, THE Validation_Middleware SHALL return a 400 status with an error message indicating the minimum password length

### Requirement 3: Duplicate Email Prevention

**User Story:** As a platform operator, I want signup to reject duplicate emails, so that each account has a unique email address.

#### Acceptance Criteria

1. WHEN a signup request contains an email that already exists in the users table, THE Signup_Service SHALL return a 400 status with the message "Email is already in use"
2. THE Signup_Service SHALL check for existing email before creating any database records

### Requirement 4: Atomic User and Workspace Creation

**User Story:** As a new user, I want my account and workspace to be created together, so that I have a fully functional workspace immediately after signup.

#### Acceptance Criteria

1. WHEN a valid signup request is received, THE Signup_Service SHALL create a new user record with the provided name, email, hashed password, and role set to ADMIN
2. WHEN a valid signup request is received, THE Signup_Service SHALL create a new Workspace record with the provided `workspace_name` as the company name and the new user's ID as the `admin_id`
3. WHEN a valid signup request is received, THE Signup_Service SHALL update the new user's `company_id` to reference the newly created Workspace
4. IF user creation succeeds but Workspace creation fails, THEN THE Signup_Service SHALL roll back the user creation so no orphaned records remain
5. IF user creation succeeds but Workspace creation fails, THEN THE Signup_Service SHALL return a 500 status with an error message indicating signup failed

### Requirement 5: Default Data Seeding

**User Story:** As a new workspace owner, I want my workspace to come with default project types and task types, so that I can start using the platform immediately.

#### Acceptance Criteria

1. WHEN a new Workspace is created during signup, THE Default_Data_Seeder SHALL insert the default project types ("Business Setup", "Relocation", "Compliance") into the `project_types` table with the new workspace's ID
2. WHEN a new Workspace is created during signup, THE Default_Data_Seeder SHALL insert the default task types ("Document Upload", "Review", "Approval", "Meeting", "Follow-up") into the `task_types` table with the new workspace's ID
3. THE Default_Data_Seeder SHALL set the `has_upload_field` flag to true for the "Document Upload" task type and false for all other task types
4. IF default data seeding fails, THEN THE Signup_Service SHALL still complete the signup successfully and log the seeding error

### Requirement 6: Email Verification OTP

**User Story:** As a platform operator, I want new users to verify their email, so that only valid email addresses are associated with accounts.

#### Acceptance Criteria

1. WHEN a new user is created during signup, THE Signup_Service SHALL generate a 6-digit OTP and store it on the user record with a 10-minute expiry
2. WHEN a new user is created during signup, THE Signup_Service SHALL send a verification email containing the OTP to the provided email address
3. THE Signup_Service SHALL use the existing `sendVerificationEmail` method to send the OTP email

### Requirement 7: JWT Token Generation

**User Story:** As a new user, I want to receive an authentication token after signup, so that I can immediately access the dashboard without logging in separately.

#### Acceptance Criteria

1. WHEN signup completes successfully, THE Signup_Service SHALL generate a JWT containing the user's ID, email, role, and company_id
2. WHEN signup completes successfully, THE Signup_Endpoint SHALL return a 200 status with a response body containing `success`, `message`, and `data` fields
3. THE Signup_Endpoint SHALL include in the `data` field: a `user` object (id, email, name, role, is_primary_admin, workspace_id), a `workspace` object (id, name, status), and a `token` string

### Requirement 8: Response Format Alignment

**User Story:** As a frontend developer, I want the signup response to match the expected format in `useWorkspaceSignup`, so that the frontend works without modifications.

#### Acceptance Criteria

1. THE Signup_Endpoint SHALL return the `user` object with fields: `id` (string), `email` (string), `name` (string), `role` (string), `is_primary_admin` (boolean set to true), and `workspace_id` (string)
2. THE Signup_Endpoint SHALL return the `workspace` object with fields: `id` (string), `name` (string), and `status` (string set to "active")
3. THE Signup_Endpoint SHALL return the `token` field as a string containing a valid JWT
4. THE Signup_Endpoint SHALL exclude the user's password hash from the response

### Requirement 9: CORS Configuration for Staging

**User Story:** As a developer deploying to staging, I want the Render frontend URL to be allowed by CORS, so that the staging frontend can communicate with the staging backend.

#### Acceptance Criteria

1. THE CORS_Config SHALL include `https://pylott-staging-frontend.onrender.com` in the list of allowed origins
2. THE CORS_Config SHALL include `https://pylott-staging-backend.onrender.com` in the list of allowed origins
3. THE CORS_Config SHALL continue to allow all previously configured origins (pylott.io, staging.pylott.io, vercel, localhost, local network, ngrok)

### Requirement 10: Password Security

**User Story:** As a platform operator, I want passwords to be securely stored, so that user credentials are protected.

#### Acceptance Criteria

1. THE Signup_Service SHALL hash the password using bcrypt before storing it in the database
2. THE Signup_Service SHALL validate password strength using the existing `validatePasswordStrength` method before creating the user
