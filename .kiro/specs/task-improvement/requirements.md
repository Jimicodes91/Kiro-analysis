# Requirements Document: Task Improvement Feature

## Introduction

This document specifies requirements for enhancing the existing task management system to support two distinct task types: Internal Tasks (assigned to admin/consultant users) and External Tasks (assigned to client contacts). The enhancement introduces role-based task assignment, project-scoped client validation, and flexible information collection for external tasks, while maintaining full backward compatibility with the existing task system.

## Glossary

- **Task_System**: The task management module responsible for creating, updating, and managing project tasks
- **Internal_Task**: A task type that can only be assigned to users with ADMIN, CONSULTANT, SUPER_ADMIN, or USER roles
- **External_Task**: A task type that is assigned to client contacts associated with a specific project
- **Task_Assignee**: A user (admin/consultant) assigned to an Internal_Task via the project_task_assignees table
- **Client_Assignee**: A client contact assigned to an External_Task via the task_client_assignees table
- **Required_Information_Item**: A custom free-text field that specifies information needed from a client for an External_Task
- **Project_Client_List**: The JSON array stored in projects.form_data.project_client containing client contact IDs associated with a project
- **Assignment_Validator**: The backend validation component that verifies assignee eligibility based on role and project association
- **Task_Type_Selector**: The UI component that allows users to choose between Internal_Task and External_Task
- **Information_Collection_Form**: The UI component for adding custom Required_Information_Items to External_Tasks
- **User_Role**: The enum field (users.role) with values: ADMIN, CLIENT, CONSULTANT, SUPER_ADMIN, USER
- **Assignee_Dropdown**: The UI component that displays filtered lists of eligible assignees based on task type
- **Backend_Validator**: The server-side validation layer that enforces business rules for task assignment
- **Database_Constraint**: Foreign key and check constraints that enforce data integrity at the database level
- **Query_Filter**: The access control mechanism that filters task queries based on user permissions

## Requirements

### Requirement 1: Task Type Classification

**User Story:** As a project manager, I want to distinguish between internal and external tasks, so that I can assign work appropriately to my team or to clients.

#### Acceptance Criteria

1. THE Task_System SHALL support two task types: Internal_Task and External_Task
2. WHEN creating a task, THE Task_Type_Selector SHALL display both Internal_Task and External_Task options
3. THE Task_System SHALL store the task type in the project_tasks table using a task_type field
4. THE Task_System SHALL maintain backward compatibility by treating existing tasks without a task_type as Internal_Task

### Requirement 2: Internal Task Assignment to Admin and Consultant Users

**User Story:** As a project manager, I want to assign internal tasks only to admin and consultant users, so that operational tasks remain within my team.

#### Acceptance Criteria

1. WHEN a user creates an Internal_Task, THE Assignee_Dropdown SHALL display only users with User_Role values of ADMIN, CONSULTANT, SUPER_ADMIN, or USER
2. THE Task_System SHALL store Internal_Task assignments in the project_task_assignees table
3. WHEN a user attempts to assign a CLIENT role user to an Internal_Task, THE Backend_Validator SHALL reject the request with an error message
4. THE Task_System SHALL support multiple Task_Assignees for a single Internal_Task
5. THE Task_System SHALL preserve all existing Internal_Task assignment functionality including notifications and file attachments

### Requirement 3: External Task Assignment to Project Clients

**User Story:** As a project manager, I want to assign external tasks to clients associated with my project, so that I can request information or actions from them.

#### Acceptance Criteria

1. WHEN a user creates an External_Task, THE Assignee_Dropdown SHALL display only client contacts from the Project_Client_List
2. THE Task_System SHALL store External_Task assignments in a new task_client_assignees table
3. THE Task_System SHALL support multiple Client_Assignees for a single External_Task
4. WHEN a user attempts to assign a user with User_Role of ADMIN, CONSULTANT, SUPER_ADMIN, or USER to an External_Task, THE Backend_Validator SHALL reject the request with an error message
5. THE Task_System SHALL send email notifications to Client_Assignees when an External_Task is created or updated

### Requirement 4: Project-Scoped Client Validation

**User Story:** As a system administrator, I want to ensure clients can only be assigned to tasks in projects they are associated with, so that data access is properly controlled.

#### Acceptance Criteria

1. WHEN loading the Assignee_Dropdown for an External_Task, THE Task_System SHALL retrieve client contacts only from the current project's Project_Client_List
2. WHEN a user submits an External_Task, THE Backend_Validator SHALL verify each Client_Assignee ID exists in the project's Project_Client_List
3. IF a Client_Assignee ID is not in the Project_Client_List, THEN THE Backend_Validator SHALL reject the request with an error message specifying the invalid client
4. THE Task_System SHALL query the projects.form_data JSON field using the project_client key to retrieve the Project_Client_List
5. WHEN a client is removed from a Project_Client_List, THE Task_System SHALL maintain existing External_Task assignments but prevent new assignments to that client

### Requirement 5: Flexible Required Information Collection

**User Story:** As a project manager, I want to specify custom information requirements for external tasks, so that I can request specific documents or data from clients.

#### Acceptance Criteria

1. WHEN creating an External_Task, THE Information_Collection_Form SHALL allow users to add multiple Required_Information_Items using free-text input
2. THE Task_System SHALL store Required_Information_Items as a JSON array in the project_tasks table
3. WHEN adding a Required_Information_Item, THE Information_Collection_Form SHALL allow users to mark it as optional
4. WHEN adding a Required_Information_Item, THE Information_Collection_Form SHALL allow users to add a note field for additional context
5. THE Task_System SHALL display Required_Information_Items to Client_Assignees when they view the External_Task
6. WHEN an Internal_Task is created, THE Task_System SHALL not display or store Required_Information_Items

### Requirement 6: Four-Layer Security Validation

**User Story:** As a security engineer, I want multiple layers of validation for client assignments, so that unauthorized access is prevented through defense in depth.

#### Acceptance Criteria

1. THE Assignee_Dropdown SHALL filter client contacts to only show those in the Project_Client_List (Layer 1: Frontend filtering)
2. THE Backend_Validator SHALL verify each Client_Assignee exists in the Project_Client_List before creating or updating an External_Task (Layer 2: Backend validation)
3. THE Database_Constraint SHALL enforce foreign key relationships between task_client_assignees and contacts tables (Layer 3: Database constraints)
4. THE Query_Filter SHALL filter task queries to only return tasks where the requesting user has project access (Layer 4: Query-time filtering)
5. IF any validation layer fails, THEN THE Task_System SHALL reject the operation and return a descriptive error message
6. THE Task_System SHALL log all validation failures for security auditing

### Requirement 7: Role-Based Assignment Validation

**User Story:** As a system administrator, I want the system to validate user roles during task assignment, so that business rules are enforced consistently.

#### Acceptance Criteria

1. WHEN validating an Internal_Task assignment, THE Backend_Validator SHALL verify each Task_Assignee has a User_Role of ADMIN, CONSULTANT, SUPER_ADMIN, or USER
2. WHEN validating an External_Task assignment, THE Backend_Validator SHALL verify each Client_Assignee has a User_Role of CLIENT
3. IF a role validation fails, THEN THE Backend_Validator SHALL return an error message identifying the invalid assignee and their role
4. THE Backend_Validator SHALL perform role validation on both task creation and task update operations
5. THE Task_System SHALL query the users.role field to determine User_Role for validation

### Requirement 8: Task Type Selector User Interface

**User Story:** As a project manager, I want a clear interface to choose between internal and external tasks, so that I can quickly create the appropriate task type.

#### Acceptance Criteria

1. WHEN a user clicks "Add Task", THE Task_System SHALL navigate to a new page displaying the Task_Type_Selector
2. THE Task_Type_Selector SHALL display two options: "Internal Task" and "External Task"
3. WHEN a user selects a task type, THE Task_System SHALL display the appropriate form fields for that task type
4. WHEN a user selects Internal_Task, THE Task_System SHALL display the Assignee_Dropdown with admin and consultant users
5. WHEN a user selects External_Task, THE Task_System SHALL display the Assignee_Dropdown with project clients and the Information_Collection_Form
6. THE Task_System SHALL allow users to change the task type selection before submitting the form

### Requirement 9: Database Schema for Client Assignments

**User Story:** As a database administrator, I want a dedicated table for external task assignments, so that client and user assignments are properly separated.

#### Acceptance Criteria

1. THE Task_System SHALL create a task_client_assignees table with columns: id, task_id, client_id, project_id, company_id, created_at, updated_at, deleted_at
2. THE Database_Constraint SHALL enforce a foreign key from task_client_assignees.task_id to project_tasks.id
3. THE Database_Constraint SHALL enforce a foreign key from task_client_assignees.client_id to contacts.id
4. THE Database_Constraint SHALL enforce a foreign key from task_client_assignees.project_id to projects.id
5. THE Database_Constraint SHALL enforce a foreign key from task_client_assignees.company_id to companies.id
6. THE Task_System SHALL create indexes on task_id, client_id, and project_id columns for query performance

### Requirement 10: Backward Compatibility with Existing Tasks

**User Story:** As a system administrator, I want all existing tasks to continue functioning without modification, so that the system upgrade is seamless.

#### Acceptance Criteria

1. THE Task_System SHALL treat all existing tasks in the project_tasks table as Internal_Tasks
2. THE Task_System SHALL preserve all existing project_task_assignees records without modification
3. THE Task_System SHALL continue to support all existing task features including status updates, date changes, file attachments, and notifications
4. WHEN querying tasks, THE Task_System SHALL return both legacy tasks and new typed tasks in a consistent format
5. THE Task_System SHALL allow editing of legacy tasks using the Internal_Task form
6. THE Task_System SHALL not require data migration for existing tasks

### Requirement 11: Task Type Persistence and Retrieval

**User Story:** As a developer, I want task types to be stored and retrieved consistently, so that the system behavior is predictable.

#### Acceptance Criteria

1. THE Task_System SHALL store the task type in the project_tasks.task_type column as an enum with values: 'internal' and 'external'
2. WHEN retrieving a task, THE Task_System SHALL include the task_type field in the response
3. WHEN retrieving an Internal_Task, THE Task_System SHALL include Task_Assignees from the project_task_assignees table
4. WHEN retrieving an External_Task, THE Task_System SHALL include Client_Assignees from the task_client_assignees table
5. WHEN retrieving an External_Task, THE Task_System SHALL include Required_Information_Items from the project_tasks.required_information JSON field

### Requirement 12: Task Update Operations

**User Story:** As a project manager, I want to update task assignments and information requirements, so that I can adapt to changing project needs.

#### Acceptance Criteria

1. WHEN updating an Internal_Task, THE Task_System SHALL allow modification of Task_Assignees following the same validation rules as task creation
2. WHEN updating an External_Task, THE Task_System SHALL allow modification of Client_Assignees following the same validation rules as task creation
3. WHEN updating an External_Task, THE Task_System SHALL allow modification of Required_Information_Items
4. THE Task_System SHALL not allow changing the task type after creation
5. WHEN Task_Assignees or Client_Assignees are modified, THE Task_System SHALL send notifications to newly added assignees
6. WHEN Task_Assignees or Client_Assignees are removed, THE Task_System SHALL send notifications to removed assignees

### Requirement 13: API Endpoint Structure

**User Story:** As a frontend developer, I want consistent API endpoints for task operations, so that I can integrate the new features easily.

#### Acceptance Criteria

1. THE Task_System SHALL accept task_type field in POST /api/v1/projects/:project_id/tasks endpoint
2. THE Task_System SHALL accept assignees array in the request body for Internal_Tasks
3. THE Task_System SHALL accept client_assignees array in the request body for External_Tasks
4. THE Task_System SHALL accept required_information array in the request body for External_Tasks
5. WHEN task_type is 'internal', THE Task_System SHALL validate and store assignees in project_task_assignees table
6. WHEN task_type is 'external', THE Task_System SHALL validate and store client_assignees in task_client_assignees table
7. THE Task_System SHALL return validation errors with HTTP 400 status code and descriptive error messages

### Requirement 14: Client Contact Retrieval

**User Story:** As a frontend developer, I want to retrieve project-specific client contacts, so that I can populate the assignee dropdown correctly.

#### Acceptance Criteria

1. THE Task_System SHALL provide an API endpoint to retrieve client contacts for a specific project
2. WHEN retrieving project clients, THE Task_System SHALL query the Project_Client_List from projects.form_data.project_client
3. THE Task_System SHALL join with the contacts table to retrieve full client details including name and email
4. THE Task_System SHALL filter results to only include active (non-deleted) client contacts
5. THE Task_System SHALL return client contacts in a format compatible with the Assignee_Dropdown component

### Requirement 15: Notification System Integration

**User Story:** As a project manager, I want assignees to receive notifications when tasks are assigned to them, so that they are aware of their responsibilities.

#### Acceptance Criteria

1. WHEN an Internal_Task is created, THE Task_System SHALL send email notifications to all Task_Assignees
2. WHEN an External_Task is created, THE Task_System SHALL send email notifications to all Client_Assignees
3. WHEN an Internal_Task is updated with new Task_Assignees, THE Task_System SHALL send email notifications to newly added assignees
4. WHEN an External_Task is updated with new Client_Assignees, THE Task_System SHALL send email notifications to newly added assignees
5. THE Task_System SHALL include task details, due dates, and Required_Information_Items in notification emails for External_Tasks
6. THE Task_System SHALL create in-app notifications for both Internal_Task and External_Task assignments

### Requirement 16: Error Handling and User Feedback

**User Story:** As a user, I want clear error messages when task operations fail, so that I can correct my mistakes quickly.

#### Acceptance Criteria

1. WHEN a validation error occurs, THE Task_System SHALL return an error message identifying the specific validation rule that failed
2. WHEN a Client_Assignee is not in the Project_Client_List, THE Task_System SHALL return an error message listing the invalid client names
3. WHEN a role validation fails, THE Task_System SHALL return an error message specifying the assignee name and their invalid role
4. WHEN a database constraint violation occurs, THE Task_System SHALL return a user-friendly error message without exposing technical details
5. THE Task_System SHALL log detailed error information for debugging while returning simplified messages to users

### Requirement 17: Query Performance Optimization

**User Story:** As a system administrator, I want task queries to perform efficiently, so that the application remains responsive as data grows.

#### Acceptance Criteria

1. THE Task_System SHALL create a composite index on task_client_assignees (task_id, client_id)
2. THE Task_System SHALL create an index on task_client_assignees.project_id for project-scoped queries
3. WHEN querying tasks for a project, THE Task_System SHALL use JOIN operations to retrieve assignees in a single query
4. THE Task_System SHALL use JSON_EXTRACT with indexed columns when querying Project_Client_List
5. WHEN filtering tasks by assignee, THE Task_System SHALL use indexed columns to optimize query performance

### Requirement 18: Access Control for Task Visibility

**User Story:** As a security engineer, I want tasks to be visible only to authorized users, so that sensitive project information is protected.

#### Acceptance Criteria

1. WHEN a CLIENT user queries tasks, THE Query_Filter SHALL return only External_Tasks where the user is a Client_Assignee
2. WHEN an ADMIN or CONSULTANT user queries tasks, THE Query_Filter SHALL return all tasks for projects they have access to
3. THE Task_System SHALL verify project membership before returning task details
4. WHEN a user attempts to view a task without project access, THE Task_System SHALL return an HTTP 403 Forbidden error
5. THE Task_System SHALL respect the existing is_visible_to_client flag for backward compatibility

### Requirement 19: Required Information Item Structure

**User Story:** As a project manager, I want to structure information requirements clearly, so that clients understand what is needed.

#### Acceptance Criteria

1. THE Task_System SHALL store each Required_Information_Item as a JSON object with fields: label, is_optional, note
2. THE Task_System SHALL validate that the label field is a non-empty string
3. THE Task_System SHALL store is_optional as a boolean value defaulting to false
4. THE Task_System SHALL allow the note field to be an optional string
5. WHEN displaying Required_Information_Items, THE Task_System SHALL clearly indicate which items are optional
6. THE Task_System SHALL preserve the order of Required_Information_Items as entered by the user

### Requirement 20: Frontend Form Validation

**User Story:** As a user, I want immediate feedback on form errors, so that I can correct issues before submitting.

#### Acceptance Criteria

1. WHEN a user attempts to submit a task without selecting a task type, THE Task_System SHALL display a validation error
2. WHEN a user attempts to submit an Internal_Task without Task_Assignees, THE Task_System SHALL display a validation error
3. WHEN a user attempts to submit an External_Task without Client_Assignees, THE Task_System SHALL display a validation error
4. WHEN a user adds a Required_Information_Item with an empty label, THE Task_System SHALL display a validation error
5. THE Task_System SHALL use the existing yup validation schema pattern for consistency
6. THE Task_System SHALL display validation errors inline next to the relevant form fields

