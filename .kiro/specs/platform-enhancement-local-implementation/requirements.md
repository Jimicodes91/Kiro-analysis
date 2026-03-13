# Requirements Document

## Introduction

This requirements document specifies the functional and non-functional requirements for the Pylot Platform Enhancement project. The system enables self-serve workspace creation, role-based access control, contact lifecycle management, enhanced task management, simplified project creation, user deactivation, and notification capabilities. The implementation targets local MySQL database deployment with a React 19 + TypeScript frontend and Node.js + TypeScript backend using Knex.js ORM.

## Glossary

- **System**: The Pylot platform enhancement application (frontend + backend + database)
- **Workspace**: An isolated tenant environment containing users, projects, contacts, and tasks
- **Super_Admin**: The highest privilege role with all permissions, created during workspace signup
- **Primary_Admin**: The first super admin created for a workspace, cannot be deactivated
- **Admin**: A user role with elevated permissions to manage users and approve invites
- **Consultant**: A user role that can create projects and contacts but requires approval to send client invites
- **Client**: A user role with limited access, linked to a contact, can only view assigned projects and client-facing tasks
- **Contact**: A person record that can be invited to become a client user
- **Contact_Status**: The lifecycle state of a contact (uninvited, invited, active)
- **Invite_Token**: A secure 64-character hexadecimal string used for client invitation acceptance
- **Task_Visibility**: Whether a task is visible to clients (inhouse, client_facing)
- **Journey**: A project type template (e.g., Business Setup, Relocation, Compliance)
- **Task_Type**: A category of task that may require document upload
- **Notification**: An in-app message sent to users about system events
- **Session**: An authenticated user connection identified by JWT token
- **Permission**: A granular capability that can be granted to users beyond their role defaults
- **Deactivated_User**: A user whose status is set to deactivated, preventing login
- **Email_Service**: External SMTP service for sending invitation and notification emails
- **Database**: MySQL 8.0+ database storing all application data
- **Transaction**: A database operation that ensures all-or-nothing execution

## Requirements

### Requirement 1: Self-Serve Workspace Creation

**User Story:** As a new user, I want to create my own workspace account, so that I can start using the platform immediately without waiting for manual provisioning.

#### Acceptance Criteria

1. WHEN a user submits a valid signup form with email, password, name, and workspace name, THE System SHALL create a new workspace with status 'active'
2. WHEN a workspace is created, THE System SHALL create a super admin user account linked to that workspace with is_primary_admin set to true
3. WHEN a super admin user is created, THE System SHALL hash the password using bcrypt with cost factor 10
4. WHEN a workspace is created, THE System SHALL seed default journeys (Business Setup, Relocation, Compliance) for that workspace
5. WHEN a workspace is created, THE System SHALL seed default task types (Document Upload, Review, Approval, Meeting, Follow-up) for that workspace
6. WHEN signup completes successfully, THE System SHALL generate a JWT token valid for 7 days
7. WHEN signup completes successfully, THE System SHALL return the user details, workspace details, and JWT token
8. IF an email already exists in the system, THEN THE System SHALL reject the signup with error "Email already exists"
9. IF any step in the signup process fails, THEN THE System SHALL rollback all database changes
10. WHEN a user signs up, THE System SHALL validate that the email is in valid email format
11. WHEN a user signs up, THE System SHALL validate that the password is at least 8 characters long

### Requirement 2: User Authentication and Session Management

**User Story:** As a registered user, I want to securely log in to my account, so that I can access my workspace and data.

#### Acceptance Criteria

1. WHEN a user submits valid email and password credentials, THE System SHALL verify the password against the stored bcrypt hash
2. WHEN credentials are valid, THE System SHALL generate a JWT token containing userId and role
3. WHEN credentials are valid, THE System SHALL return user details and JWT token
4. WHEN credentials are invalid, THE System SHALL return error "Invalid credentials"
5. WHEN a user with status 'deactivated' attempts to login, THE System SHALL reject the login attempt
6. WHEN a JWT token is generated, THE System SHALL set expiration to 7 days
7. WHEN a JWT token is provided in a request, THE System SHALL verify the token signature and expiration
8. WHEN a user logs out, THE System SHALL invalidate the session token
9. WHEN a JWT token expires, THE System SHALL require the user to log in again

### Requirement 3: Role-Based Permission System

**User Story:** As a system administrator, I want to enforce role-based access control, so that users can only perform actions appropriate to their role.

#### Acceptance Criteria

1. THE System SHALL support four user roles: super_admin, admin, consultant, and client
2. WHEN a user has role super_admin, THE System SHALL grant all permissions
3. WHEN a user has role admin, THE System SHALL grant permissions to invite users, approve client invites, and manage projects
4. WHEN a user has role consultant, THE System SHALL grant permissions to create projects and contacts but require approval for client invites
5. WHEN a user has role client, THE System SHALL restrict access to only assigned projects and client-facing tasks
6. WHEN a permission check is performed, THE System SHALL first check role-based permissions then explicit permission grants
7. WHEN a permission is granted to a user, THE System SHALL record the granting user ID and timestamp
8. THE System SHALL prevent duplicate permission grants for the same user and permission combination
9. WHEN a user attempts an action, THE System SHALL verify they have the required permission before allowing the action
10. IF a user lacks required permission, THEN THE System SHALL return HTTP 403 Forbidden error

### Requirement 4: Contact Creation and Management

**User Story:** As an admin or consultant, I want to create and manage contact records, so that I can track potential and active clients.

#### Acceptance Criteria

1. WHEN a user creates a contact with name, email, and phone, THE System SHALL insert a new contact record with status 'uninvited'
2. WHEN a contact is created, THE System SHALL validate that the email is in valid email format and unique
3. WHEN a contact is created, THE System SHALL validate that the phone number is provided
4. IF a contact with the same email already exists, THEN THE System SHALL reject the creation with error "Contact with this email already exists"
5. WHEN a contact is created with send_invite_immediately set to true by an admin or super admin, THE System SHALL create an invite record with status 'sent' and send the invitation email immediately
6. WHEN a contact is created with send_invite_immediately set to true by a consultant, THE System SHALL create an invite request with status 'pending' and notify admins for approval
7. WHEN a contact is created with send_invite_immediately set to false or not provided, THE System SHALL only create the contact record without any invite actions
8. WHEN an invitation email is sent, THE System SHALL include the contact name, inviter name, workspace name, invite link with token, and optional custom message
9. WHEN a contact is created, THE System SHALL initialize active_projects, total_projects, and closed_projects counters to 0
10. WHEN a contact record is updated, THE System SHALL update the updated_at timestamp


### Requirement 5: Contact Invitation Workflow

**User Story:** As an admin or consultant, I want to invite contacts to become client users, so that they can access the platform and view their projects.

#### Acceptance Criteria

1. WHEN an admin or super admin sends an invite to a contact with status 'uninvited', THE System SHALL create an invite record with status 'sent'
2. WHEN an admin or super admin sends an invite, THE System SHALL update the contact status to 'invited' and set invited_at and invited_by fields
3. WHEN an admin or super admin sends an invite, THE System SHALL send an invitation email to the contact email address
4. WHEN a consultant sends an invite to a contact with status 'uninvited', THE System SHALL create an invite request with status 'pending'
5. WHEN a consultant sends an invite, THE System SHALL notify all admins and super admins in the workspace for approval
6. WHEN an invite is created, THE System SHALL generate a unique 64-character hexadecimal token
7. WHEN an invite is created, THE System SHALL set expiration to 7 days from creation
8. IF a contact status is 'invited' or 'active', THEN THE System SHALL reject additional invite attempts
9. WHEN an admin approves a pending invite, THE System SHALL update the invite status to 'approved', send the invitation email, and update contact status to 'invited'
10. WHEN an admin rejects a pending invite, THE System SHALL update the invite status to 'rejected' and notify the requesting consultant
11. WHEN an invitation email is sent, THE System SHALL include the invite token in the acceptance link

### Requirement 6: Client Invitation Acceptance and Account Activation

**User Story:** As an invited contact, I want to accept my invitation and create my account, so that I can access the platform as a client.

#### Acceptance Criteria

1. WHEN a contact clicks an invite link with a valid token, THE System SHALL retrieve the corresponding invite record
2. IF the invite token is invalid or not found, THEN THE System SHALL return error "Invalid invite token"
3. IF the invite has expired (expires_at < current time), THEN THE System SHALL return error "Invite has expired"
4. IF the invite status is not 'sent' or 'approved', THEN THE System SHALL return error "Invite is not ready for acceptance"
5. IF the invite has already been accepted (accepted_at is not null), THEN THE System SHALL return error "Invite has already been accepted"
6. WHEN a contact accepts an invite with a valid password, THE System SHALL create a user account with role 'client'
7. WHEN a client user account is created, THE System SHALL hash the password using bcrypt with cost factor 10
8. WHEN a client user account is created, THE System SHALL link the contact to the user by setting contact.user_id
9. WHEN a client user account is created, THE System SHALL update the contact status to 'active'
10. WHEN a client user account is created, THE System SHALL mark the invite as accepted by setting accepted_at timestamp
11. WHEN invite acceptance completes, THE System SHALL generate a JWT token for the new client user
12. WHEN invite acceptance completes, THE System SHALL notify the inviting user that the contact has joined
13. IF any step in the acceptance process fails, THEN THE System SHALL rollback all database changes

### Requirement 7: Simplified Project Creation with Contact Linking

**User Story:** As an admin or consultant, I want to create projects with simplified contact information, so that I can quickly set up new projects without complex forms.

#### Acceptance Criteria

1. WHEN a user creates a project with client_email and client_phone, THE System SHALL search for an existing contact with that email
2. IF no contact exists with the provided email, THEN THE System SHALL create a new contact with status 'uninvited'
3. IF a contact exists with the provided email, THEN THE System SHALL use the existing contact and update the phone number if different
4. WHEN a new contact is created during project creation, THE System SHALL use client_name if provided, otherwise extract name from email
5. WHEN a project is created, THE System SHALL link it to the contact via client_contact_id
6. WHEN a project is created, THE System SHALL validate that name, project_type_id, start_date, client_email, and client_phone are provided
7. WHEN a project is created, THE System SHALL set status to 'not_started'
8. WHEN a project is created, THE System SHALL increment the contact's active_projects and total_projects counters
9. WHEN a project is created with send_client_invite set to true and contact status is 'uninvited', THE System SHALL follow the same invite workflow as contact creation (admin sends immediately, consultant requires approval)
10. WHEN a project is created with send_client_invite set to true by an admin, THE System SHALL send invitation email with project context
11. WHEN a project is created with send_client_invite set to true by a consultant, THE System SHALL create pending invite request and notify admins with project context
12. WHEN a project is created with send_client_invite set to false or contact is already invited/active, THE System SHALL not perform any invite actions
13. WHEN a project invitation email is sent, THE System SHALL include project name and optional custom message
14. IF any step in project creation fails, THEN THE System SHALL rollback all database changes including contact creation

### Requirement 8: Enhanced Task Management

**User Story:** As a project manager, I want to create and manage tasks with visibility controls and optional fields, so that I can organize work appropriately for different audiences.

#### Acceptance Criteria

1. WHEN a user creates a task, THE System SHALL require name, due_date, visibility, and at least one assignee
2. WHEN a user creates a task, THE System SHALL allow description to be optional (nullable)
3. WHEN a user creates a task, THE System SHALL validate that visibility is either 'inhouse' or 'client_facing'
4. WHEN a user creates a task, THE System SHALL set status to 'pending'
5. THE System SHALL support only two task statuses: 'pending' and 'completed'
6. WHEN a task is created, THE System SHALL store due_date (renamed from end_date)
7. WHEN a task is created with task_type that has_upload_field set to true, THE System SHALL allow document_url to be provided
8. WHEN a task is created, THE System SHALL link it to the project via project_id
9. WHEN a task is created, THE System SHALL record the creating user as author_id
10. WHEN a task is created, THE System SHALL insert assignee records for each provided assignee user ID
11. WHEN a task is updated, THE System SHALL update the updated_at timestamp
12. WHEN a client user queries tasks, THE System SHALL only return tasks with visibility 'client_facing'
13. WHEN an admin, super admin, or consultant queries tasks, THE System SHALL return all tasks regardless of visibility
14. WHEN a task name exceeds 255 characters, THE System SHALL reject the creation
15. WHEN a task description exceeds 5000 characters, THE System SHALL reject the creation

### Requirement 9: Task Assignment Notifications

**User Story:** As a user, I want to receive notifications when I am assigned to tasks, so that I am aware of my responsibilities.

#### Acceptance Criteria

1. WHEN a task is created with assignees, THE System SHALL create a notification for each assignee
2. WHEN creating task assignment notifications, THE System SHALL exclude the task author from receiving a notification
3. WHEN a notification is created, THE System SHALL set type to 'task_assigned'
4. WHEN a notification is created, THE System SHALL set title to 'New Task Assigned'
5. WHEN a notification is created, THE System SHALL include the author name and task name in the message
6. WHEN a notification is created, THE System SHALL include a link to the task details page
7. WHEN a notification is created, THE System SHALL set read_at to null (unread)
8. WHEN a user views their notifications, THE System SHALL return notifications ordered by created_at descending
9. WHEN a user marks a notification as read, THE System SHALL set read_at to the current timestamp
10. WHEN a user marks all notifications as read, THE System SHALL update read_at for all unread notifications
11. WHEN a user queries their unread notification count, THE System SHALL return the count of notifications where read_at is null
12. IF an assignee user ID is invalid or user does not exist, THEN THE System SHALL skip creating notification for that assignee without failing the task creation

### Requirement 10: User Deactivation and Reactivation

**User Story:** As a super admin, I want to deactivate and reactivate user accounts, so that I can manage access without deleting user data.

#### Acceptance Criteria

1. WHEN a super admin deactivates a user, THE System SHALL update the user status to 'deactivated'
2. WHEN a user is deactivated, THE System SHALL set deactivated_at to the current timestamp
3. WHEN a user is deactivated, THE System SHALL record the deactivating user ID in deactivated_by
4. WHEN a user is deactivated, THE System SHALL invalidate all active sessions for that user
5. WHEN a user is deactivated, THE System SHALL log the deactivation action in the audit trail
6. IF a user with is_primary_admin set to true is targeted for deactivation, THEN THE System SHALL reject the request with error "Cannot deactivate primary admin"
7. IF a user with status 'deactivated' is targeted for deactivation again, THEN THE System SHALL reject the request with error "User is already deactivated"
8. IF a non-super admin attempts to deactivate a user, THEN THE System SHALL reject the request with HTTP 403 Forbidden
9. WHEN a super admin reactivates a user, THE System SHALL update the user status to 'active'
10. WHEN a user is reactivated, THE System SHALL require a password reset before allowing login
11. WHEN a deactivated user attempts to login, THE System SHALL reject the login attempt

### Requirement 11: Workspace Integrity and Primary Admin Protection

**User Story:** As a system architect, I want to ensure every workspace has exactly one primary admin, so that workspace ownership is always clear and protected.

#### Acceptance Criteria

1. THE System SHALL ensure every workspace has exactly one user with is_primary_admin set to true
2. WHEN a workspace is created, THE System SHALL set is_primary_admin to true for the first super admin user
3. WHEN a user with is_primary_admin set to true is targeted for deactivation, THE System SHALL prevent the deactivation
4. WHEN a user with is_primary_admin set to true is targeted for role change, THE System SHALL prevent the change unless another user is designated as primary admin first
5. WHEN querying workspace users, THE System SHALL be able to identify the primary admin by is_primary_admin flag
6. THE System SHALL enforce database constraint preventing multiple users with is_primary_admin true in the same workspace


### Requirement 12: Contact Status Lifecycle Management

**User Story:** As a system architect, I want to enforce valid contact status transitions, so that contact lifecycle is predictable and data integrity is maintained.

#### Acceptance Criteria

1. THE System SHALL support three contact statuses: 'uninvited', 'invited', and 'active'
2. WHEN a contact is created, THE System SHALL set status to 'uninvited'
3. WHEN a contact receives an invite, THE System SHALL transition status from 'uninvited' to 'invited'
4. WHEN a contact accepts an invite, THE System SHALL transition status from 'invited' to 'active'
5. THE System SHALL prevent status transitions from 'active' to 'invited' or 'uninvited'
6. THE System SHALL prevent status transitions from 'invited' to 'uninvited'
7. WHEN a contact status is 'invited', THE System SHALL ensure invited_at and invited_by fields are not null
8. WHEN a contact status is 'active', THE System SHALL ensure user_id field is not null
9. WHEN a contact status is 'active', THE System SHALL ensure the linked user has role 'client'
10. IF an invalid status transition is attempted, THEN THE System SHALL reject the change with error "Invalid status transition"

### Requirement 13: Invite Token Security and Expiration

**User Story:** As a security architect, I want to ensure invite tokens are secure and time-limited, so that unauthorized access is prevented.

#### Acceptance Criteria

1. WHEN an invite is created, THE System SHALL generate a cryptographically secure random token
2. WHEN an invite token is generated, THE System SHALL ensure it is exactly 64 characters in hexadecimal format
3. WHEN an invite token is generated, THE System SHALL ensure it is unique across all invites
4. WHEN an invite is created, THE System SHALL set expires_at to 7 days from creation time
5. WHEN an invite token is validated, THE System SHALL check if current time is before expires_at
6. IF an invite token has expired, THEN THE System SHALL reject acceptance with error "Invite has expired"
7. WHEN an invite is accepted, THE System SHALL set accepted_at to the current timestamp
8. WHEN an invite has been accepted (accepted_at is not null), THE System SHALL reject subsequent acceptance attempts
9. THE System SHALL store invite tokens in the database with unique constraint
10. WHEN an admin resends an invite, THE System SHALL generate a new token with fresh expiration

### Requirement 14: Project-Contact Association Integrity

**User Story:** As a data architect, I want to ensure every project is linked to a valid contact, so that client relationships are always traceable.

#### Acceptance Criteria

1. WHEN a project is created, THE System SHALL require a valid client_contact_id
2. WHEN a project is created, THE System SHALL validate that the client_contact_id references an existing contact
3. THE System SHALL enforce foreign key constraint between projects.client_contact_id and contacts.id
4. WHEN a project is created, THE System SHALL increment the linked contact's active_projects counter
5. WHEN a project is created, THE System SHALL increment the linked contact's total_projects counter
6. WHEN a project status changes to 'completed' or 'closed', THE System SHALL decrement the contact's active_projects counter
7. WHEN a project status changes to 'completed' or 'closed', THE System SHALL increment the contact's closed_projects counter
8. WHEN querying projects for a client user, THE System SHALL only return projects where the client_contact_id links to a contact with user_id matching the client user
9. IF a project is created with an invalid client_contact_id, THEN THE System SHALL reject the creation with error "Invalid contact reference"

### Requirement 15: Permission Granting and Auditing

**User Story:** As a compliance officer, I want to track who grants permissions to whom, so that access changes are auditable.

#### Acceptance Criteria

1. WHEN a permission is granted to a user, THE System SHALL record the granting user ID in granted_by field
2. WHEN a permission is granted, THE System SHALL record the timestamp in created_at field
3. WHEN a permission is granted, THE System SHALL validate that the granting user is a super admin or has permission to grant permissions
4. IF a non-authorized user attempts to grant a permission, THEN THE System SHALL reject the request with HTTP 403 Forbidden
5. THE System SHALL prevent duplicate permission grants by enforcing unique constraint on (user_id, permission_key)
6. WHEN a permission is revoked, THE System SHALL delete the permission record
7. WHEN querying a user's permissions, THE System SHALL return both role-based and explicitly granted permissions
8. WHEN auditing permission changes, THE System SHALL provide a history of all grants and revocations with timestamps and granting users

### Requirement 16: Email Notification System

**User Story:** As a user, I want to receive email notifications for important events, so that I stay informed even when not actively using the platform.

#### Acceptance Criteria

1. WHEN a contact invite is sent, THE System SHALL send an email to the contact's email address
2. WHEN an invite email is sent, THE System SHALL include the contact name, inviter name, workspace name, and invite acceptance link
3. WHEN an invite email is sent with a custom message, THE System SHALL include the custom message in the email body
4. WHEN a consultant requests to send an invite, THE System SHALL send notification emails to all admins and super admins in the workspace
5. WHEN an invite is approved by an admin, THE System SHALL send an email to the contact with the invite link
6. WHEN a contact accepts an invite, THE System SHALL send a notification email to the inviting user
7. WHEN a task is assigned to a user, THE System SHALL optionally send an email notification if the user has email notifications enabled
8. WHEN an email fails to send, THE System SHALL log the error but not fail the primary operation (invite creation, task assignment, etc.)
9. THE System SHALL use SMTP configuration from environment variables for email sending
10. THE System SHALL support email templates using Handlebars for consistent formatting

### Requirement 17: Database Transaction Integrity

**User Story:** As a system architect, I want all multi-step operations to be atomic, so that partial failures do not leave the database in an inconsistent state.

#### Acceptance Criteria

1. WHEN a signup operation is performed, THE System SHALL execute all steps (workspace creation, user creation, seeding) within a single database transaction
2. WHEN a project creation operation is performed, THE System SHALL execute all steps (contact creation/update, project creation, counter updates, invite creation) within a single database transaction
3. WHEN a client activation operation is performed, THE System SHALL execute all steps (user creation, contact linking, invite marking) within a single database transaction
4. IF any step within a transaction fails, THEN THE System SHALL rollback all changes made within that transaction
5. WHEN a transaction is rolled back, THE System SHALL return an appropriate error message to the user
6. WHEN a transaction completes successfully, THE System SHALL commit all changes atomically
7. THE System SHALL use database connection pooling to manage concurrent transactions efficiently
8. THE System SHALL set appropriate transaction isolation levels to prevent race conditions

### Requirement 18: Input Validation and Sanitization

**User Story:** As a security engineer, I want all user inputs to be validated and sanitized, so that injection attacks and data corruption are prevented.

#### Acceptance Criteria

1. WHEN a user submits an email address, THE System SHALL validate it matches standard email format
2. WHEN a user submits a password, THE System SHALL validate it is at least 8 characters long
3. WHEN a user submits a phone number, THE System SHALL validate it is not empty
4. WHEN a user submits a task name, THE System SHALL validate it does not exceed 255 characters
5. WHEN a user submits a task description, THE System SHALL validate it does not exceed 5000 characters
6. WHEN a user submits HTML content, THE System SHALL sanitize it to prevent XSS attacks
7. THE System SHALL use parameterized queries for all database operations to prevent SQL injection
8. WHEN a user submits a date field, THE System SHALL validate it is in valid date format
9. WHEN a user submits an enum field (role, status, visibility), THE System SHALL validate it matches allowed values
10. IF validation fails, THEN THE System SHALL return HTTP 400 Bad Request with specific error messages

### Requirement 19: Authentication Token Management

**User Story:** As a security engineer, I want JWT tokens to be securely generated and validated, so that session hijacking is prevented.

#### Acceptance Criteria

1. WHEN a JWT token is generated, THE System SHALL include userId and role in the payload
2. WHEN a JWT token is generated, THE System SHALL sign it with a secret key from environment variables
3. WHEN a JWT token is generated, THE System SHALL set expiration to 7 days
4. WHEN a JWT token is generated, THE System SHALL use HS256 algorithm for signing
5. WHEN a JWT token is provided in a request, THE System SHALL verify the signature before trusting the payload
6. WHEN a JWT token is expired, THE System SHALL reject the request with HTTP 401 Unauthorized
7. WHEN a JWT token signature is invalid, THE System SHALL reject the request with HTTP 401 Unauthorized
8. WHEN a user logs out, THE System SHALL invalidate the token (if using session storage)
9. WHEN a user is deactivated, THE System SHALL invalidate all active tokens for that user
10. THE System SHALL store JWT tokens in HTTP-only cookies to prevent XSS access

### Requirement 20: Rate Limiting and Abuse Prevention

**User Story:** As a system administrator, I want to prevent abuse through rate limiting, so that the system remains available for legitimate users.

#### Acceptance Criteria

1. WHEN a user makes authentication requests, THE System SHALL limit to 5 attempts per 15-minute window
2. WHEN a user exceeds authentication rate limit, THE System SHALL return HTTP 429 Too Many Requests
3. WHEN a user makes API requests, THE System SHALL limit to 100 requests per minute
4. WHEN a user exceeds API rate limit, THE System SHALL return HTTP 429 Too Many Requests with retry-after header
5. WHEN an IP address has excessive failed login attempts, THE System SHALL temporarily block that IP
6. WHEN an IP is blocked, THE System SHALL log the security event with IP address and reason
7. THE System SHALL track failed login attempts per IP address with expiration
8. WHEN a user successfully logs in, THE System SHALL reset the failed attempt counter for that IP
9. THE System SHALL apply stricter rate limits to sensitive endpoints (signup, password reset)
10. THE System SHALL allow rate limit configuration through environment variables


### Requirement 21: Password Security and Hashing

**User Story:** As a security engineer, I want passwords to be securely hashed and stored, so that user credentials are protected even if the database is compromised.

#### Acceptance Criteria

1. WHEN a user creates an account, THE System SHALL hash the password using bcrypt with cost factor 10
2. WHEN a user logs in, THE System SHALL compare the provided password against the stored bcrypt hash
3. THE System SHALL never store passwords in plain text
4. THE System SHALL never log passwords in application logs
5. THE System SHALL never return password hashes in API responses
6. WHEN a user changes their password, THE System SHALL hash the new password using bcrypt
7. WHEN a user is reactivated, THE System SHALL require a password reset before allowing login
8. THE System SHALL validate password complexity requirements (minimum 8 characters)
9. THE System SHALL reject passwords that are too weak or common
10. WHEN password hashing fails, THE System SHALL return a generic error without exposing implementation details

### Requirement 22: Notification Type Support

**User Story:** As a product manager, I want to support multiple notification types, so that users receive contextually appropriate messages.

#### Acceptance Criteria

1. THE System SHALL support notification type 'task_assigned' for task assignment events
2. THE System SHALL support notification type 'task_completed' for task completion events
3. THE System SHALL support notification type 'project_updated' for project modification events
4. THE System SHALL support notification type 'invite_received' for client invitation events
5. THE System SHALL support notification type 'invite_approved' for consultant invite approval events
6. THE System SHALL support notification type 'invite_approval_required' for admin notification of pending invites
7. WHEN a notification is created, THE System SHALL validate that the type is one of the supported types
8. WHEN a notification is displayed, THE System SHALL format it according to its type
9. WHEN a notification includes a link, THE System SHALL ensure the link points to the relevant resource
10. THE System SHALL allow future addition of new notification types without database schema changes

### Requirement 23: Consultant Invite Approval Workflow

**User Story:** As an admin, I want to review and approve consultant invite requests, so that I maintain control over client access.

#### Acceptance Criteria

1. WHEN a consultant creates a contact with send_invite_immediately set to true, THE System SHALL create an invite with status 'pending'
2. WHEN a consultant sends an invite to an existing uninvited contact, THE System SHALL create an invite with status 'pending'
3. WHEN a pending invite is created, THE System SHALL notify all admins and super admins in the workspace
4. WHEN an admin views pending invites, THE System SHALL display the contact name, consultant name, and request timestamp
5. WHEN an admin approves a pending invite, THE System SHALL update the invite status to 'approved'
6. WHEN an admin approves a pending invite, THE System SHALL send the invitation email to the contact
7. WHEN an admin approves a pending invite, THE System SHALL update the contact status to 'invited'
8. WHEN an admin approves a pending invite, THE System SHALL notify the requesting consultant
9. WHEN an admin rejects a pending invite, THE System SHALL update the invite status to 'rejected'
10. WHEN an admin rejects a pending invite, THE System SHALL notify the requesting consultant with the rejection reason
11. WHEN an admin rejects a pending invite, THE System SHALL keep the contact status as 'uninvited'
12. IF an admin or super admin creates a contact or sends an invite, THEN THE System SHALL bypass the approval workflow and send immediately

### Requirement 24: Task Visibility Enforcement

**User Story:** As a project manager, I want to control which tasks are visible to clients, so that internal work remains private.

#### Acceptance Criteria

1. WHEN a task is created, THE System SHALL require visibility to be set to either 'inhouse' or 'client_facing'
2. WHEN a client user queries tasks for a project, THE System SHALL only return tasks with visibility 'client_facing'
3. WHEN a client user attempts to view an inhouse task directly, THE System SHALL return HTTP 403 Forbidden
4. WHEN an admin, super admin, or consultant queries tasks, THE System SHALL return all tasks regardless of visibility
5. WHEN a task visibility is updated from 'client_facing' to 'inhouse', THE System SHALL immediately hide it from client users
6. WHEN a task visibility is updated from 'inhouse' to 'client_facing', THE System SHALL immediately show it to client users
7. WHEN displaying task counts, THE System SHALL only count client_facing tasks for client users
8. WHEN a client user is assigned to an inhouse task, THE System SHALL not create a notification for that client
9. THE System SHALL validate that visibility value is one of the two allowed values
10. IF an invalid visibility value is provided, THEN THE System SHALL reject the request with error "Visibility must be either 'inhouse' or 'client_facing'"

### Requirement 25: Project Value and Metadata Management

**User Story:** As a project manager, I want to track optional project metadata like value and nationality, so that I can analyze projects by various dimensions.

#### Acceptance Criteria

1. WHEN a project is created, THE System SHALL allow project_value to be optional (nullable)
2. WHEN a project is created, THE System SHALL allow nationality to be optional (nullable)
3. WHEN a project is created, THE System SHALL allow notes to be optional (nullable)
4. WHEN project_value is provided, THE System SHALL validate it is a positive number
5. WHEN nationality is provided, THE System SHALL validate it is a valid 2-letter country code
6. WHEN notes are provided, THE System SHALL store them in the notes field (replacing deprecated description field)
7. THE System SHALL not require client_organization, resident_country, postcode, or end_date fields (deprecated)
8. WHEN querying projects, THE System SHALL return project_value, nationality, and notes if they are set
9. WHEN filtering projects by value range, THE System SHALL support queries like "project_value between X and Y"
10. WHEN filtering projects by nationality, THE System SHALL support queries like "nationality = 'US'"

### Requirement 26: Default Journey and Task Type Seeding

**User Story:** As a new workspace owner, I want default journeys and task types to be created automatically, so that I can start using the platform immediately.

#### Acceptance Criteria

1. WHEN a workspace is created, THE System SHALL create a journey named 'Business Setup' linked to that workspace
2. WHEN a workspace is created, THE System SHALL create a journey named 'Relocation' linked to that workspace
3. WHEN a workspace is created, THE System SHALL create a journey named 'Compliance' linked to that workspace
4. WHEN a workspace is created, THE System SHALL create a task type named 'Document Upload' with has_upload_field set to true
5. WHEN a workspace is created, THE System SHALL create a task type named 'Review' with has_upload_field set to false
6. WHEN a workspace is created, THE System SHALL create a task type named 'Approval' with has_upload_field set to false
7. WHEN a workspace is created, THE System SHALL create a task type named 'Meeting' with has_upload_field set to false
8. WHEN a workspace is created, THE System SHALL create a task type named 'Follow-up' with has_upload_field set to false
9. WHEN seeding defaults, THE System SHALL link all journeys and task types to the workspace_id
10. IF seeding fails, THEN THE System SHALL rollback the entire workspace creation transaction

### Requirement 27: Audit Trail and Security Logging

**User Story:** As a compliance officer, I want all security-relevant actions to be logged, so that I can audit system access and changes.

#### Acceptance Criteria

1. WHEN a user is deactivated, THE System SHALL log the action with deactivating user ID, target user ID, reason, and timestamp
2. WHEN a permission is granted, THE System SHALL log the action with granting user ID, target user ID, permission, and timestamp
3. WHEN a user login fails, THE System SHALL log the attempt with email, IP address, and timestamp
4. WHEN a user login succeeds, THE System SHALL log the event with user ID, IP address, and timestamp
5. WHEN an invite is approved or rejected, THE System SHALL log the action with admin ID, invite ID, decision, and timestamp
6. WHEN a contact status changes, THE System SHALL log the transition with old status, new status, and timestamp
7. WHEN a project is created, THE System SHALL log the action with creating user ID, project ID, and timestamp
8. WHEN a task is assigned, THE System SHALL log the action with author ID, task ID, assignee IDs, and timestamp
9. THE System SHALL store audit logs in a dedicated audit_logs table
10. THE System SHALL retain audit logs for at least 90 days for compliance purposes

### Requirement 28: Error Handling and User Feedback

**User Story:** As a user, I want to receive clear error messages when operations fail, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN a validation error occurs, THE System SHALL return HTTP 400 Bad Request with specific field errors
2. WHEN an authentication error occurs, THE System SHALL return HTTP 401 Unauthorized with message "Invalid credentials"
3. WHEN an authorization error occurs, THE System SHALL return HTTP 403 Forbidden with message "Insufficient permissions"
4. WHEN a resource is not found, THE System SHALL return HTTP 404 Not Found with message identifying the resource type
5. WHEN a database constraint is violated, THE System SHALL return HTTP 409 Conflict with a user-friendly message
6. WHEN an internal server error occurs, THE System SHALL return HTTP 500 Internal Server Error with a generic message
7. WHEN an internal server error occurs, THE System SHALL log the full error details for debugging
8. THE System SHALL never expose sensitive information (passwords, tokens, internal paths) in error messages
9. WHEN a transaction fails and is rolled back, THE System SHALL return an error indicating the operation failed
10. WHEN rate limit is exceeded, THE System SHALL return HTTP 429 Too Many Requests with retry-after header

### Requirement 29: Database Indexing and Query Performance

**User Story:** As a system administrator, I want database queries to be optimized with appropriate indexes, so that the system remains responsive under load.

#### Acceptance Criteria

1. THE System SHALL create an index on users.email for fast authentication lookups
2. THE System SHALL create an index on users.workspace_id for workspace-scoped queries
3. THE System SHALL create an index on users.role for role-based filtering
4. THE System SHALL create an index on users.status for status-based filtering
5. THE System SHALL create an index on contacts.email for contact lookup during project creation
6. THE System SHALL create an index on contacts.status for status-based filtering
7. THE System SHALL create an index on contact_invites.token for invite validation
8. THE System SHALL create an index on contact_invites.expires_at for expiration checks
9. THE System SHALL create an index on tasks.project_id for project task queries
10. THE System SHALL create an index on tasks.visibility for visibility filtering
11. THE System SHALL create a composite index on notifications(user_id, read_at) for unread count queries
12. THE System SHALL create an index on projects.client_contact_id for contact-project lookups
13. WHEN querying large result sets, THE System SHALL support pagination with limit and offset
14. WHEN counting records, THE System SHALL use optimized count queries with indexes

### Requirement 30: Session and Cookie Management

**User Story:** As a security engineer, I want session tokens to be stored securely in HTTP-only cookies, so that XSS attacks cannot steal tokens.

#### Acceptance Criteria

1. WHEN a user logs in successfully, THE System SHALL set a cookie named 'user_session_token' with the JWT token
2. WHEN setting the session cookie, THE System SHALL set httpOnly flag to true to prevent JavaScript access
3. WHEN setting the session cookie, THE System SHALL set secure flag to true in production to require HTTPS
4. WHEN setting the session cookie, THE System SHALL set sameSite to 'strict' to prevent CSRF attacks
5. WHEN setting the session cookie, THE System SHALL set maxAge to 7 days (604800 seconds)
6. WHEN a user logs out, THE System SHALL clear the session cookie
7. WHEN a user's session expires, THE System SHALL require re-authentication
8. WHEN a user is deactivated, THE System SHALL invalidate all session cookies for that user
9. THE System SHALL validate the session cookie on every authenticated request
10. IF the session cookie is missing or invalid, THEN THE System SHALL return HTTP 401 Unauthorized

