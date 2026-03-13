# Implementation Plan: Pylot Platform Enhancement - Local Implementation

## Overview

This implementation plan breaks down the platform enhancement features into discrete, incremental coding tasks. The plan follows a phased approach starting with foundational infrastructure (database, authentication) and building up to user-facing features (contacts, projects, tasks, notifications). Each task builds on previous work and includes references to specific requirements for traceability.

The implementation uses TypeScript for both frontend (React 19 + Vite + TanStack Query) and backend (Node.js + Express + Knex.js) with MySQL 8.0+ database.

## Tasks

- [x] 1. Set up database infrastructure and migrations
  - Create Knex.js configuration for MySQL connection
  - Create migration files for all new tables (workspaces, users, user_permissions, contacts, contact_invites, tasks, projects, notifications, audit_logs, security_logs)
  - Create migration files for table modifications (tasks table updates, projects table updates)
  - Add database indexes for performance (users.email, contacts.email, contact_invites.token, tasks.project_id, notifications.user_id)
  - Create seed files for default journeys and task types
  - Run migrations on local MySQL database and verify schema
  - _Requirements: 1.4, 1.5, 26.1-26.10, 29.1-29.14_

- [x] 2. Implement authentication and workspace creation
  - [x] 2.1 Create backend authentication service and endpoints
    - Implement POST /api/v1/auth/signup endpoint with workspace creation, user creation, and default seeding
    - Implement POST /api/v1/auth/login endpoint with credential verification and JWT generation
    - Implement POST /api/v1/auth/logout endpoint with session invalidation
    - Add bcrypt password hashing with cost factor 10
    - Add JWT token generation with 7-day expiration
    - Add transaction handling for atomic signup operations
    - Add input validation for email format and password length
    - Add error handling for duplicate emails and database failures
    - _Requirements: 1.1-1.11, 2.1-2.9, 21.1-21.10_
  
  - [ ]* 2.2 Write property test for signup workspace integrity
    - **Property 1: Workspace Integrity** - Every successful signup creates exactly one workspace and one super admin with is_primary_admin true
    - **Validates: Requirements 1.1, 1.2, 11.1, 11.2**
  
  - [x] 2.3 Create frontend signup and login pages
    - Create SignUp.tsx component with form fields (email, password, name, workspace_name)
    - Create Login.tsx component with credential form
    - Add form validation using react-hook-form and yup
    - Implement signup API call with error handling and Toast notifications
    - Implement login API call with JWT token storage in cookies
    - Add redirect to dashboard on successful authentication
    - Add error message display using formatErrorMessage utility
    - _Requirements: 1.1-1.11, 2.1-2.9_
  
  - [ ]* 2.4 Write unit tests for authentication endpoints
    - Test signup with valid data creates workspace and user
    - Test signup with duplicate email returns error
    - Test login with valid credentials returns token
    - Test login with invalid credentials returns error
    - Test login with deactivated user is rejected
    - _Requirements: 1.8, 2.4, 2.5_

- [x] 3. Checkpoint - Verify authentication flow
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement permission system and role-based access control
  - [x] 4.1 Create permission service and middleware
    - Implement validatePermission() function with role-based and explicit permission checks
    - Create requireRole() middleware for endpoint protection
    - Create requirePermission() middleware for granular permission checks
    - Implement permission matrix for role-based defaults
    - Add super admin bypass for all permission checks
    - _Requirements: 3.1-3.10, 15.1-15.8_
  
  - [x] 4.2 Create permission management endpoints
    - Implement POST /api/v1/permissions/grant endpoint for granting permissions
    - Implement DELETE /api/v1/permissions/revoke endpoint for revoking permissions
    - Implement GET /api/v1/users/:id/permissions endpoint for querying user permissions
    - Add validation that only super admins can grant permissions
    - Add audit logging for permission changes
    - Add unique constraint enforcement for (user_id, permission_key)
    - _Requirements: 15.1-15.8_
  
  - [ ]* 4.3 Write property test for permission enforcement
    - **Property 3: Permission Enforcement** - Super admins always have all permissions, other roles follow permission matrix
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**
  
  - [x] 4.4 Add permission checks to existing endpoints
    - Protect user management endpoints with super_admin role requirement
    - Protect contact invite endpoints with invite_client permission
    - Protect project creation endpoints with manage_projects permission
    - Add permission validation to all sensitive operations
    - _Requirements: 3.9, 3.10_

- [x] 5. Implement contact creation and management
  - [x] 5.1 Create contact service and database operations
    - Implement createContact() function with email uniqueness validation
    - Implement contact status management (uninvited, invited, active)
    - Add contact project counter initialization (active_projects, total_projects, closed_projects)
    - Add validation for email format and phone number
    - Add transaction handling for contact creation
    - _Requirements: 4.1-4.10, 12.1-12.10_
  
  - [x] 5.2 Create contact management endpoints
    - Implement POST /api/v1/contacts endpoint with optional send_invite_immediately support
    - Implement GET /api/v1/contacts endpoint with filtering and pagination
    - Implement GET /api/v1/contacts/:id endpoint for contact details
    - Implement PUT /api/v1/contacts/:id endpoint for contact updates
    - Add support for immediate invite sending during contact creation (admin sends immediately, consultant requires approval)
    - Add error handling for duplicate emails and validation failures
    - _Requirements: 4.1-4.10_
  
  - [ ]* 5.3 Write property test for contact status transitions
    - **Property 4: Contact Status Transitions** - Contact status only moves forward (uninvited → invited → active), never backward
    - **Validates: Requirements 12.2, 12.3, 12.4, 12.5, 12.6**
  
  - [x] 5.4 Create frontend contact management UI
    - Create CreateContactForm.tsx with fields (name, email, phone, organization, address)
    - Add optional send_invite_immediately checkbox with custom message field
    - Create ContactTable.tsx with status badges and action buttons
    - Add "Send Invite" button for uninvited contacts
    - Implement contact creation API call with Toast notifications
    - Add error handling and user feedback for different invite scenarios (immediate send, pending approval)
    - _Requirements: 4.1-4.10_
  
  - [ ]* 5.5 Write unit tests for contact creation
    - Test contact creation with valid data
    - Test contact creation with duplicate email returns error
    - Test contact creation with send_invite_immediately by admin sends immediately
    - Test contact creation with send_invite_immediately by consultant requires approval
    - Test contact validation for email and phone
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [x] 6. Implement contact invitation workflow
  - [x] 6.1 Create invite service and token generation
    - Implement generateSecureToken() function using crypto.randomBytes(32)
    - Implement sendInvite() function with approval workflow logic
    - Add invite expiration handling (7 days)
    - Add invite status management (pending, approved, rejected, sent)
    - Add admin notification for consultant invite requests
    - _Requirements: 5.1-5.11, 13.1-13.10, 23.1-23.12_
  
  - [x] 6.2 Create invitation endpoints
    - Implement POST /api/v1/contacts/:id/send-invite endpoint with approval workflow
    - Implement GET /api/v1/invites/pending endpoint for admin review
    - Implement POST /api/v1/invites/:id/approve endpoint for admin approval
    - Implement POST /api/v1/invites/:id/reject endpoint for admin rejection
    - Add email sending for approved invites
    - Add consultant notification for approval/rejection
    - _Requirements: 5.1-5.11, 23.1-23.12_
  
  - [x] 6.3 Set up email service integration
    - Configure nodemailer with SMTP settings from environment variables
    - Create email templates using Handlebars (client-invitation, project-client-invitation, invite-approval-required)
    - Implement sendInvitationEmail() function with template rendering
    - Add error handling for email failures (log but don't fail primary operation)
    - Test email sending with Mailtrap in development
    - _Requirements: 16.1-16.10_
  
  - [ ]* 6.4 Write property test for invite token uniqueness
    - **Property 10: Invite Token Uniqueness** - All generated invite tokens are unique across all invites
    - **Validates: Requirements 13.2, 13.3, 13.9**
  
  - [x] 6.5 Create frontend invite approval UI for admins
    - Create PendingInvitesTable.tsx showing consultant invite requests
    - Add approve/reject buttons with confirmation dialogs
    - Implement approve/reject API calls with Toast notifications
    - Add filtering and sorting for pending invites
    - _Requirements: 23.4-23.12_

- [x] 7. Implement client invitation acceptance and account activation
  - [x] 7.1 Create invite acceptance service
    - Implement acceptInvite() function with token validation
    - Add invite expiration checking
    - Add invite status validation (must be 'sent' or 'approved')
    - Add duplicate acceptance prevention
    - Add user account creation with role 'client'
    - Add contact linking and status update to 'active'
    - Add transaction handling for atomic activation
    - _Requirements: 6.1-6.13_
  
  - [x] 7.2 Create invite acceptance endpoint
    - Implement POST /api/v1/contacts/accept-invite endpoint
    - Add password validation and bcrypt hashing
    - Add JWT token generation for new client user
    - Add notification to inviting user on acceptance
    - Add error handling for invalid/expired tokens
    - _Requirements: 6.1-6.13_
  
  - [ ]* 7.3 Write property test for contact-user linking
    - **Property 8: Contact-User Linking** - Active contacts always have user_id set and linked user has role 'client'
    - **Validates: Requirements 6.8, 6.9, 12.8, 12.9**
  
  - [x] 7.4 Create frontend accept invite page
    - Create AcceptInvite.tsx page with token extraction from URL
    - Add password creation form with validation
    - Implement accept invite API call with error handling
    - Add redirect to projects page on successful activation
    - Add error messages for expired/invalid tokens
    - _Requirements: 6.1-6.13_
  
  - [ ]* 7.5 Write integration test for complete invitation flow
    - Test admin sends invite → contact receives email → contact accepts → user created → contact active
    - Test consultant requests invite → admin approves → contact receives email → contact accepts
    - Test expired token rejection
    - Test duplicate acceptance prevention
    - _Requirements: 5.1-5.11, 6.1-6.13_

- [x] 8. Checkpoint - Verify contact and invitation workflows
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement simplified project creation with contact linking
  - [x] 9.1 Create project service with contact auto-linking
    - Implement createProject() function with contact search/create logic
    - Add contact auto-creation when email doesn't exist
    - Add contact phone update when using existing contact
    - Add project-contact linking via client_contact_id
    - Add contact project counter updates (active_projects, total_projects)
    - Add optional client invite sending during project creation
    - Add transaction handling for atomic project creation
    - _Requirements: 7.1-7.14, 14.1-14.9_
  
  - [x] 9.2 Create project creation endpoint
    - Implement POST /api/v1/projects endpoint with simplified fields
    - Add validation for required fields (name, project_type_id, start_date, client_email, client_phone)
    - Add support for optional fields (client_name, project_value, nationality, notes)
    - Add support for send_client_invite checkbox with approval workflow
    - Remove deprecated fields (description, client_organization, resident_country, postcode, end_date)
    - Add error handling for validation failures and database errors
    - _Requirements: 7.1-7.14, 25.1-25.10_
  
  - [ ]* 9.3 Write property test for project-contact association
    - **Property 9: Project-Contact Association** - Every project is associated with a valid contact via client_contact_id
    - **Validates: Requirements 14.1, 14.2, 14.3**
  
  - [x] 9.4 Create frontend project creation form
    - Create CreateProjectForm.tsx with simplified fields
    - Add client email and phone fields (required)
    - Add optional fields (client_name, project_value, nationality, notes)
    - Add journey selection dropdown
    - Add optional send_client_invite checkbox with custom message field
    - Remove deprecated fields from form
    - Implement project creation API call with Toast notifications
    - Add feedback for contact creation (new vs existing) and invite status
    - _Requirements: 7.1-7.14, 25.1-25.10_
  
  - [ ]* 9.5 Write unit tests for project creation
    - Test project creation with new contact email creates contact
    - Test project creation with existing contact email uses existing contact
    - Test project creation updates contact phone if different
    - Test project creation increments contact counters
    - Test project creation with send_client_invite by admin sends immediately
    - Test project creation with send_client_invite by consultant requires approval
    - _Requirements: 7.2, 7.3, 7.4, 7.8, 7.9, 7.10_

- [x] 10. Implement enhanced task management
  - [x] 10.1 Update task data model and validation
    - Update task schema to remove start_date field
    - Rename end_date to due_date in database and code
    - Add visibility field with enum ('inhouse', 'client_facing')
    - Make description field optional (nullable)
    - Update status enum to only include 'pending' and 'completed'
    - Add document_url field for task types with upload capability
    - Add validation for task name length (max 255 characters)
    - Add validation for task description length (max 5000 characters)
    - _Requirements: 8.1-8.15_
  
  - [x] 10.2 Create task management endpoints
    - Implement POST /api/v1/tasks endpoint with new structure
    - Implement GET /api/v1/tasks endpoint with visibility filtering
    - Implement PUT /api/v1/tasks/:id endpoint for task updates
    - Implement DELETE /api/v1/tasks/:id endpoint for task deletion
    - Add visibility enforcement (clients only see client_facing tasks)
    - Add assignee management (insert into task_assignees table)
    - Add validation for required fields (name, due_date, visibility, assignees)
    - _Requirements: 8.1-8.15, 24.1-24.10_
  
  - [ ]* 10.3 Write property test for task visibility enforcement
    - **Property 6: Task Visibility** - In-house tasks are never visible to client users
    - **Validates: Requirements 8.12, 24.2, 24.3**
  
  - [x] 10.4 Create frontend task management UI
    - Update CreateTaskForm.tsx to remove start_date field
    - Update form to use due_date instead of end_date
    - Add visibility dropdown (inhouse, client_facing)
    - Make description field optional
    - Update status options to only show pending and completed
    - Add document upload field for task types with has_upload_field true
    - Update TaskTable.tsx to show visibility badges
    - Add visibility filtering for task lists
    - _Requirements: 8.1-8.15, 24.1-24.10_
  
  - [ ]* 10.5 Write unit tests for task management
    - Test task creation with required fields
    - Test task creation with optional description
    - Test task validation for name and description length
    - Test visibility filtering for client users
    - Test visibility filtering for admin/consultant users
    - _Requirements: 8.2, 8.14, 8.15, 8.12, 8.13_

- [x] 11. Implement task assignment notifications
  - [x] 11.1 Create notification service and database operations
    - Implement createNotification() function with type validation
    - Implement getUserNotifications() function with pagination
    - Implement markAsRead() function for single notification
    - Implement markAllAsRead() function for bulk updates
    - Implement getUnreadCount() function with optimized query
    - Add notification type enum support (task_assigned, task_completed, project_updated, invite_received, invite_approved, invite_approval_required)
    - _Requirements: 9.1-9.12, 22.1-22.10_
  
  - [x] 11.2 Add notification triggers for task assignments
    - Update task creation to trigger notifications for assignees
    - Exclude task author from receiving notification
    - Add notification creation in transaction with task creation
    - Add notification message formatting with author name and task name
    - Add notification link to task details page
    - Add optional email notification if user has email_notifications_enabled
    - _Requirements: 9.1-9.12_
  
  - [ ]* 11.3 Write property test for notification uniqueness
    - **Property 7: Notification Uniqueness** - Each task assignment creates exactly one notification per assignee (excluding author)
    - **Validates: Requirements 9.1, 9.2, 9.11**
  
  - [x] 11.4 Create notification endpoints
    - Implement GET /api/v1/notifications endpoint with pagination
    - Implement GET /api/v1/notifications/unread-count endpoint
    - Implement POST /api/v1/notifications/:id/mark-read endpoint
    - Implement POST /api/v1/notifications/mark-all-read endpoint
    - Add ordering by created_at descending
    - _Requirements: 9.8, 9.9, 9.10, 9.11_
  
  - [x] 11.5 Create frontend notification UI
    - Create NotificationBell.tsx component with unread count badge
    - Create NotificationDropdown.tsx with notification list
    - Add mark as read functionality on notification click
    - Add mark all as read button
    - Add notification center page with full list and pagination
    - Add real-time unread count updates using TanStack Query
    - _Requirements: 9.8, 9.9, 9.10, 9.11_
  
  - [ ]* 11.6 Write unit tests for notification system
    - Test notification creation for task assignment
    - Test author exclusion from notifications
    - Test unread count calculation
    - Test mark as read functionality
    - Test mark all as read functionality
    - _Requirements: 9.2, 9.11, 9.9, 9.10_

- [ ] 12. Checkpoint - Verify project, task, and notification features
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement user deactivation and reactivation
  - [ ] 13.1 Create user deactivation service
    - Implement deactivateUser() function with primary admin protection
    - Add session invalidation for deactivated users
    - Add audit logging for deactivation actions
    - Add validation that only super admins can deactivate users
    - Add validation to prevent deactivating already deactivated users
    - Add transaction handling for atomic deactivation
    - _Requirements: 10.1-10.11, 11.1-11.6_
  
  - [ ] 13.2 Create user deactivation endpoints
    - Implement POST /api/v1/users/:id/deactivate endpoint
    - Implement POST /api/v1/users/:id/reactivate endpoint
    - Implement GET /api/v1/users/:id/status endpoint
    - Add super admin role requirement for deactivation endpoints
    - Add error handling for primary admin deactivation attempts
    - Add error handling for already deactivated users
    - _Requirements: 10.1-10.11_
  
  - [ ]* 13.3 Write property test for primary admin protection
    - **Property 5: Primary Admin Protection** - Primary admins can never be deactivated
    - **Validates: Requirements 10.6, 11.3**
  
  - [ ] 13.4 Update authentication to block deactivated users
    - Add status check in login endpoint
    - Reject login attempts for users with status 'deactivated'
    - Add error message "Your account has been deactivated"
    - _Requirements: 2.5, 10.11_
  
  - [ ] 13.5 Create frontend user deactivation UI
    - Add deactivate button to user management table
    - Add confirmation dialog for deactivation
    - Add deactivated status badge to user table
    - Add reactivate button for deactivated users
    - Implement deactivate/reactivate API calls with Toast notifications
    - Add error handling for primary admin deactivation attempts
    - _Requirements: 10.1-10.11_
  
  - [ ]* 13.6 Write integration test for deactivation flow
    - Test super admin deactivates user → status updated → sessions invalidated → login rejected
    - Test primary admin deactivation is prevented
    - Test already deactivated user deactivation is prevented
    - Test reactivation updates status to active
    - _Requirements: 10.1-10.11_

- [ ] 14. Implement security features and error handling
  - [ ] 14.1 Add input validation and sanitization
    - Create validation middleware using express-validator
    - Add email format validation for all email inputs
    - Add password strength validation (minimum 8 characters)
    - Add phone number validation
    - Add enum validation for role, status, visibility fields
    - Add length validation for text fields (task name, description)
    - Add HTML sanitization using DOMPurify for user-generated content
    - _Requirements: 18.1-18.10_
  
  - [ ] 14.2 Implement rate limiting and abuse prevention
    - Add rate limiting middleware using express-rate-limit
    - Set authentication endpoint limit to 5 attempts per 15 minutes
    - Set API endpoint limit to 100 requests per minute
    - Add IP-based blocking for excessive failed login attempts
    - Add security event logging for blocked IPs
    - Add rate limit configuration via environment variables
    - _Requirements: 20.1-20.10_
  
  - [ ] 14.3 Add comprehensive error handling
    - Create error formatter utility for consistent error responses
    - Add user-friendly error messages for all error scenarios
    - Add HTTP status code mapping (400, 401, 403, 404, 409, 429, 500)
    - Add error logging for internal server errors
    - Ensure sensitive information is never exposed in error messages
    - Add transaction rollback error handling
    - _Requirements: 28.1-28.10_
  
  - [ ] 14.4 Implement JWT token security
    - Add JWT token signing with HS256 algorithm
    - Add JWT token verification middleware
    - Add token expiration checking
    - Add HTTP-only cookie configuration for token storage
    - Add secure flag for production HTTPS
    - Add sameSite strict flag for CSRF protection
    - Add session invalidation on logout and deactivation
    - _Requirements: 19.1-19.10, 30.1-30.10_
  
  - [ ]* 14.5 Write property test for authentication security
    - **Property 2: User Authentication** - No deactivated user can successfully authenticate
    - **Validates: Requirements 2.5, 10.11**
  
  - [ ] 14.6 Add audit trail and security logging
    - Create audit_logs and security_logs tables
    - Implement logAuditTrail() function for action logging
    - Implement logSecurityEvent() function for security event logging
    - Add logging for user deactivation, permission grants, login attempts
    - Add logging for contact status changes, project creation, task assignments
    - Add 90-day retention policy for audit logs
    - _Requirements: 27.1-27.10_

- [ ] 15. Implement database performance optimizations
  - [ ] 15.1 Add database indexes
    - Create index on users.email for authentication lookups
    - Create index on users.workspace_id for workspace queries
    - Create index on users.role for role filtering
    - Create index on users.status for status filtering
    - Create index on contacts.email for contact lookups
    - Create index on contacts.status for status filtering
    - Create index on contact_invites.token for invite validation
    - Create index on contact_invites.expires_at for expiration checks
    - Create index on tasks.project_id for project task queries
    - Create index on tasks.visibility for visibility filtering
    - Create composite index on notifications(user_id, read_at) for unread queries
    - Create index on projects.client_contact_id for contact-project lookups
    - _Requirements: 29.1-29.14_
  
  - [ ] 15.2 Optimize database queries
    - Add pagination support to all list endpoints (limit, offset)
    - Use batch inserts for notification creation
    - Use joins for eager loading (avoid N+1 queries)
    - Add database connection pooling configuration
    - Optimize unread notification count query with index
    - _Requirements: 29.13, 29.14_
  
  - [ ]* 15.3 Write performance tests
    - Test authentication endpoint response time < 200ms
    - Test list endpoint response time < 300ms
    - Test create/update endpoint response time < 500ms
    - Test unread notification count query < 100ms

- [ ] 16. Create frontend utilities and shared components
  - [ ] 16.1 Create error handling utilities
    - Create formatErrorMessage() utility for consistent error formatting
    - Create formatValidationError() utility for field-specific errors
    - Add HTTP status code to message mapping
    - Add backend error message passthrough
    - _Requirements: 28.1-28.10_
  
  - [ ] 16.2 Create Toast notification system
    - Configure react-toastify for global Toast notifications
    - Create Toast.success(), Toast.error(), Toast.info() helpers
    - Add Toast notifications to all API calls (success and error)
    - Add consistent positioning and styling
    - _Requirements: 28.1-28.10_
  
  - [ ] 16.3 Create custom hooks for API calls
    - Create useCreateContact() hook using TanStack Query
    - Create useSendContactInvite() hook
    - Create useCreateProject() hook
    - Create useCreateTask() hook
    - Create useNotifications() hook with unread count
    - Create useDeactivateUser() hook
    - Add optimistic updates and cache invalidation
    - Add error handling and Toast notifications in hooks
  
  - [ ] 16.4 Create shared UI components
    - Create StatusBadge component for contact/user status display
    - Create ConfirmDialog component for destructive actions
    - Create LoadingSpinner component for async operations
    - Create EmptyState component for empty lists
    - Create Pagination component for list views

- [ ] 17. Integration and end-to-end testing
  - [ ] 17.1 Write integration tests for complete workflows
    - Test complete signup flow (workspace creation → user creation → default seeding → login)
    - Test complete contact invitation flow (create contact → send invite → accept invite → user created)
    - Test complete project creation flow (create project → auto-create contact → link contact → update counters)
    - Test complete task assignment flow (create task → assign users → notifications created)
    - Test complete deactivation flow (deactivate user → sessions invalidated → login blocked)
    - _Requirements: All requirements_
  
  - [ ]* 17.2 Write property-based tests for system invariants
    - **Property 1: Workspace Integrity** - Every workspace has exactly one primary admin
    - **Property 11: Task Status Validity** - Tasks only have valid status values (pending, completed)
    - **Property 12: Permission Granting Authority** - Only authorized users can grant permissions
  
  - [ ] 17.3 Perform manual testing of all features
    - Test signup and login flows in browser
    - Test contact creation and invitation workflows
    - Test project creation with new and existing contacts
    - Test task creation with visibility controls
    - Test notification system and unread counts
    - Test user deactivation and reactivation
    - Test permission system and role-based access
    - Test error handling and user feedback
  
  - [ ] 17.4 Fix bugs and address issues
    - Review and fix any failing tests
    - Address any edge cases discovered during testing
    - Improve error messages based on testing feedback
    - Optimize performance bottlenecks

- [ ] 18. Final checkpoint and deployment preparation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based and unit tests that can be skipped for faster MVP delivery
- Each task references specific requirements for traceability (e.g., _Requirements: 1.1-1.11_)
- Implementation uses TypeScript for both frontend and backend
- Frontend: React 19 + Vite + TanStack Query + Tailwind CSS
- Backend: Node.js + Express + Knex.js + MySQL 8.0+
- All API calls should use Toast notifications for user feedback
- All database operations should use transactions for atomicity
- All endpoints should have comprehensive error handling with user-friendly messages
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
