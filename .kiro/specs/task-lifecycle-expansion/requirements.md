# Requirements Document: Task Lifecycle Expansion

## Introduction

This document specifies requirements for expanding the task lifecycle in the Pylott platform. The current task system supports only two statuses (pending and completed) and treats task types as simple metadata labels. This feature introduces a full lifecycle state machine (Draft → Sent → In Progress → Completed → Archived), promotes Signing and Information Request to first-class task types with specialized behavior, enhances task creation forms to be type-driven, and extends the notes/comments system to tasks. The goal is to support richer client-facing workflows (document upload, document signing, information requests) and internal workflows (review, approvals) with proper status tracking, transition validation, and activity logging.

## Glossary

- **Task_System**: The task management module responsible for creating, updating, and managing project tasks across both backend and frontend
- **Task_Lifecycle**: The ordered set of statuses a task moves through: Draft, Sent, In_Progress, Completed, Archived
- **Status_Transition_Validator**: The component that enforces allowed transitions between task statuses
- **Activity_Logger**: The component that records every status change and significant task event to the audit trail
- **Signing_Task**: A first-class task type for document signing workflows with its own sub-status tracking (Sent → Viewed → Signed → Completed)
- **Information_Request_Task**: A first-class task type for collecting information from clients, supporting either a native form attachment or an external form link
- **Document_Upload_Task**: A task type where clients upload documents with name, description, and file validation
- **Task_Type_Behavior**: The set of form fields, validations, and UI components specific to a given task type
- **Task_Comment**: A note or comment attached to a task, extending the existing project notes/comments pattern
- **Signing_Sub_Status**: The sub-status tracking specific to Signing_Tasks: Sent, Viewed, Signed, Completed
- **Form_Attachment**: A reference to a form template or external form URL attached to an Information_Request_Task
- **Internal_Task**: A task assigned to internal team members (ADMIN, CONSULTANT, SUPER_ADMIN, USER roles) for review, approvals, or internal processing
- **External_Task**: A task assigned to client contacts for document uploads, signing, or information requests
- **Transition_Map**: The defined set of valid from-status to to-status pairs that govern task lifecycle movement

## Requirements

### Requirement 1: Expanded Task Status Lifecycle

**User Story:** As a project manager, I want tasks to follow a multi-step lifecycle, so that I can track task progress from creation through completion and archival.

#### Acceptance Criteria

1. THE Task_System SHALL support the following Task_Lifecycle statuses: Draft, Sent, In_Progress, Completed, Archived
2. WHEN a task is created, THE Task_System SHALL set the initial status to Draft
3. THE Task_System SHALL store the task status in the project_tasks.status column using the expanded enum values: 'draft', 'sent', 'in_progress', 'completed', 'archived'
4. THE Task_System SHALL treat existing tasks with status 'pending' as equivalent to 'sent' for backward compatibility
5. WHEN displaying tasks, THE Task_System SHALL render a status badge corresponding to the current Task_Lifecycle status

### Requirement 2: Status Transition Validation

**User Story:** As a system administrator, I want status transitions to follow defined rules, so that tasks cannot skip lifecycle steps or move to invalid states.

#### Acceptance Criteria

1. THE Status_Transition_Validator SHALL enforce the following Transition_Map:
   - Draft → Sent
   - Sent → In_Progress
   - In_Progress → Completed
   - Completed → Archived
   - Sent → Draft (allow reverting to draft)
   - In_Progress → Sent (allow reverting to sent)
2. WHEN a user attempts a status transition not in the Transition_Map, THE Status_Transition_Validator SHALL reject the request with an error message identifying the current status and the attempted target status
3. THE Status_Transition_Validator SHALL validate transitions on both the backend API and the frontend UI
4. WHEN displaying status change options, THE Task_System SHALL show only the valid next statuses from the Transition_Map for the current status
5. THE Status_Transition_Validator SHALL perform validation before any status update is persisted to the database

### Requirement 3: Activity Logging for Status Changes

**User Story:** As a project manager, I want every status change recorded, so that I can review the full history of a task's progression.

#### Acceptance Criteria

1. WHEN a task status changes, THE Activity_Logger SHALL create an audit trail entry containing: task_id, previous_status, new_status, user_id, and timestamp
2. THE Activity_Logger SHALL use the existing AuditTrailService to persist status change records
3. THE Task_System SHALL add new audit trail actions: TASK_STATUS_CHANGED, TASK_ARCHIVED, TASK_SENT
4. WHEN viewing task details, THE Task_System SHALL display the activity log in chronological order
5. THE Activity_Logger SHALL record the user who initiated each status change

### Requirement 4: Signing Task Type

**User Story:** As a project manager, I want a dedicated Signing task type, so that I can track document signing workflows with granular status visibility.

#### Acceptance Criteria

1. THE Task_System SHALL support Signing_Task as a first-class task type with specific behavior distinct from metadata-only task types
2. WHEN creating a Signing_Task, THE Task_System SHALL require at least one document attachment for signing
3. THE Task_System SHALL track Signing_Sub_Status values: 'sent', 'viewed', 'signed', 'completed' independently from the main Task_Lifecycle status
4. WHEN a Signing_Task document is viewed by the client, THE Task_System SHALL update the Signing_Sub_Status to 'viewed'
5. WHEN a Signing_Task document is signed, THE Task_System SHALL update the Signing_Sub_Status to 'signed' and store the signed document in the project's documents collection
6. WHEN displaying a Signing_Task, THE Task_System SHALL show both the Task_Lifecycle status and the Signing_Sub_Status
7. THE Task_System SHALL store the Signing_Sub_Status in a signing_status column on the project_tasks table, applicable only to Signing_Tasks

### Requirement 5: Information Request Task Type

**User Story:** As a project manager, I want a dedicated Information Request task type, so that I can collect structured information from clients using either a built-in form or an external form link.

#### Acceptance Criteria

1. THE Task_System SHALL support Information_Request_Task as a first-class task type with specific behavior distinct from metadata-only task types
2. WHEN creating an Information_Request_Task, THE Task_System SHALL require the user to choose one mode: native form attachment or external form link
3. WHEN the native form mode is selected, THE Task_System SHALL allow attaching a Form_Attachment reference to the task
4. WHEN the external form link mode is selected, THE Task_System SHALL validate that the provided URL is a well-formed URL and store it on the task record
5. WHEN a client submits a response to an Information_Request_Task, THE Task_System SHALL store the submission in the task activity log and associate it with the client's contact profile
6. THE Task_System SHALL store the form mode ('native' or 'external') and the form reference (form_id or external_url) in a form_config JSON column on the project_tasks table

### Requirement 6: Type-Driven Task Creation Form

**User Story:** As a project manager, I want the task creation form to adapt based on the selected task type, so that I only see relevant fields for the type of task I am creating.

#### Acceptance Criteria

1. WHEN a user selects a task type during creation, THE Task_System SHALL display only the form fields relevant to that Task_Type_Behavior
2. WHEN the Signing task type is selected, THE Task_System SHALL display: document upload field, signer selection (from project clients), and signing instructions field
3. WHEN the Information Request task type is selected, THE Task_System SHALL display: mode selector (native form or external link), form/link attachment field, and request description
4. WHEN the Document Upload task type is selected, THE Task_System SHALL display: document name, description, accepted file types, and maximum file size configuration
5. WHEN the Review or Approval task type is selected, THE Task_System SHALL display the standard internal task fields: assignee selection, description, and due date
6. THE Task_System SHALL preserve the existing external-task-form and internal-task-form patterns while extending them with type-specific field sections

### Requirement 7: Document Upload Task Behavior

**User Story:** As a client, I want to upload documents through a task with clear requirements, so that I know exactly what files are needed and in what format.

#### Acceptance Criteria

1. WHEN a client views a Document_Upload_Task, THE Task_System SHALL display the document name, description, and upload interface
2. THE Task_System SHALL validate uploaded files against configured allowed file types (e.g., PDF, DOCX, JPG, PNG)
3. THE Task_System SHALL validate uploaded file size against a configured maximum size limit
4. IF a client uploads a file that does not match the allowed file types, THEN THE Task_System SHALL reject the upload with an error message listing the accepted file types
5. IF a client uploads a file that exceeds the maximum size limit, THEN THE Task_System SHALL reject the upload with an error message stating the maximum allowed size
6. WHEN a document is successfully uploaded, THE Task_System SHALL store the document using the existing Cloudinary storage integration and tag it with the task_id and project_id
7. WHEN a document is successfully uploaded, THE Activity_Logger SHALL record the upload event with the document name and uploader identity

### Requirement 8: Task Comments and Notes

**User Story:** As a team member, I want to add comments and notes to tasks, so that I can communicate context and updates within the task itself.

#### Acceptance Criteria

1. THE Task_System SHALL support adding Task_Comments to any task, extending the existing project notes/comments pattern
2. WHEN a user adds a Task_Comment, THE Task_System SHALL store the comment with: task_id, author_id, content, and timestamp
3. WHEN viewing task details, THE Task_System SHALL display Task_Comments in chronological order
4. THE Task_System SHALL allow both internal team members and client contacts to add Task_Comments on External_Tasks
5. WHEN a Task_Comment is added, THE Activity_Logger SHALL record the comment event in the task activity log
6. THE Task_System SHALL support deleting Task_Comments by the comment author or by users with ADMIN or SUPER_ADMIN roles

### Requirement 9: Internal Task Enhancements

**User Story:** As a team lead, I want internal tasks to support review and approval workflows with proper assignment and tracking, so that internal processes are managed within the task system.

#### Acceptance Criteria

1. WHEN creating an Internal_Task, THE Task_System SHALL allow assignment to one or more internal team members with roles ADMIN, CONSULTANT, SUPER_ADMIN, or USER
2. THE Task_System SHALL support the full Task_Lifecycle (Draft → Sent → In_Progress → Completed → Archived) for Internal_Tasks
3. WHEN an Internal_Task status changes, THE Task_System SHALL send in-app notifications to all assigned team members
4. THE Task_System SHALL display Internal_Tasks only to assigned team members and users with ADMIN or SUPER_ADMIN roles
5. WHEN an Internal_Task of type Review or Approval is completed, THE Activity_Logger SHALL record the completion with the reviewer or approver identity

### Requirement 10: Notification System Extension for Lifecycle Events

**User Story:** As a task assignee, I want to receive notifications when task status changes, so that I stay informed about task progress without manually checking.

#### Acceptance Criteria

1. WHEN a task transitions from Draft to Sent, THE Task_System SHALL send notifications to all task assignees using the existing NotificationEventEmitter
2. WHEN a task transitions to Completed, THE Task_System SHALL send a completion notification to the task author and all assignees
3. WHEN a Signing_Task Signing_Sub_Status changes, THE Task_System SHALL send a notification to the task author with the updated signing status
4. THE Task_System SHALL add new notification event types: task_status_changed, task_sent, task_archived, signing_status_changed
5. WHEN a Task_Comment is added, THE Task_System SHALL send a notification to all task participants (author and assignees) except the comment author

### Requirement 11: Signed Document Storage

**User Story:** As a project manager, I want signed documents to be automatically stored in the project's document collection, so that I have a complete record without manual filing.

#### Acceptance Criteria

1. WHEN a Signing_Task reaches Signing_Sub_Status 'signed', THE Task_System SHALL create a document record in the project's documents collection
2. THE Task_System SHALL store the signed document using the existing Cloudinary storage integration with a 'signed' tag
3. THE Task_System SHALL associate the stored signed document with both the task_id and the project_id
4. WHEN the signed document is stored, THE Activity_Logger SHALL record the storage event with document name, signer identity, and timestamp
5. THE Task_System SHALL make the signed document accessible from both the task detail view and the project documents list

### Requirement 12: Task Archival

**User Story:** As a project manager, I want to archive completed tasks, so that they are preserved for reference but do not clutter active task lists.

#### Acceptance Criteria

1. WHEN a task has status Completed, THE Task_System SHALL allow transitioning to Archived status
2. WHEN viewing active task lists, THE Task_System SHALL exclude tasks with Archived status by default
3. THE Task_System SHALL provide a filter option to include Archived tasks in task list views
4. WHEN a task is archived, THE Activity_Logger SHALL record the archival event with the archiving user's identity
5. THE Task_System SHALL allow ADMIN and SUPER_ADMIN users to unarchive a task by transitioning it back to Completed status

### Requirement 13: Database Schema Extensions

**User Story:** As a developer, I want the database schema to support the expanded task lifecycle and new task type behaviors, so that data is stored consistently and efficiently.

#### Acceptance Criteria

1. THE Task_System SHALL add a signing_status column (enum: 'sent', 'viewed', 'signed', 'completed', nullable) to the project_tasks table
2. THE Task_System SHALL add a form_config column (JSON, nullable) to the project_tasks table for Information_Request_Task configuration
3. THE Task_System SHALL add a task_category column (enum: 'signing', 'information_request', 'document_upload', 'review', 'approval', 'meeting', 'follow_up', nullable) to the project_tasks table to identify first-class task type behavior
4. THE Task_System SHALL create a task_comments table with columns: id, task_id, author_id, content, company_id, created_at, updated_at, deleted_at
5. THE Task_System SHALL create a task_activity_log table with columns: id, task_id, action, previous_value, new_value, user_id, metadata (JSON), company_id, created_at
6. THE Task_System SHALL update the project_tasks.status enum to include: 'draft', 'sent', 'in_progress', 'completed', 'archived'
7. THE Task_System SHALL create indexes on task_comments.task_id and task_activity_log.task_id for query performance

### Requirement 14: Backward Compatibility

**User Story:** As a system administrator, I want existing tasks and workflows to continue functioning after the lifecycle expansion, so that the upgrade is non-disruptive.

#### Acceptance Criteria

1. THE Task_System SHALL map existing 'pending' status values to 'sent' when reading tasks from the database
2. THE Task_System SHALL map existing 'completed' status values to 'completed' in the new lifecycle without modification
3. THE Task_System SHALL treat tasks without a task_category value as generic tasks that follow the standard Task_Lifecycle
4. THE Task_System SHALL preserve all existing task API endpoint contracts while extending them with new optional fields
5. THE Task_System SHALL not require a data migration for existing tasks; status mapping SHALL occur at the application layer
6. THE Task_System SHALL maintain the existing is_visible_to_client flag behavior alongside the new lifecycle statuses

### Requirement 15: Task List Filtering and Display

**User Story:** As a user, I want to filter and view tasks by their lifecycle status, so that I can focus on tasks that need attention.

#### Acceptance Criteria

1. THE Task_System SHALL provide filter options for each Task_Lifecycle status: Draft, Sent, In_Progress, Completed, Archived
2. WHEN no filter is selected, THE Task_System SHALL display all non-archived tasks by default
3. THE Task_System SHALL display a status indicator on each task card or row showing the current Task_Lifecycle status with a distinct color per status
4. WHEN viewing Signing_Tasks, THE Task_System SHALL display the Signing_Sub_Status alongside the main status
5. THE Task_System SHALL update the existing taskStatuses constant in the frontend to include all new lifecycle statuses
6. THE Task_System SHALL support filtering tasks by task_category to view only specific task types
