# Implementation Plan: Task Improvement Feature

## Overview

This plan implements the task categorization system (Internal/External tasks) across the full stack: database migrations, backend models/services/routes, and frontend pages/components. Each step builds incrementally, starting with the data layer and working up to the UI, with wiring and integration at the end.

## Tasks

- [x] 1. Database migrations for task categorization and new tables
  - [x] 1.1 Create migration to add task_category, required_information, and additional_info columns to project_tasks table
    - Add `task_category` ENUM('internal', 'external') column with default 'internal' to `project_tasks`
    - Add `required_information` JSON column (nullable) for external tasks
    - Add `additional_info` JSON column (nullable) for internal tasks
    - Add index on `task_category`
    - Make `name` column nullable (optional for internal tasks)
    - File: `Pylott-Backend/migrations/YYYYMMDD_add_task_category_columns.ts`
    - _Requirements: 1.1, 1.3, 1.4, 5.2, 5.6, 9.1, 10.1, 10.6, 11.1_

  - [x] 1.2 Create migration for task_client_assignees table
    - Create `task_client_assignees` table with columns: id, task_id, client_id, project_id, company_id, created_at, updated_at, deleted_at
    - Add foreign keys to project_tasks, contacts, projects, companies
    - Add indexes on task_id, client_id, project_id, and composite index on (project_id, client_id)
    - File: `Pylott-Backend/migrations/YYYYMMDD_create_task_client_assignees.ts`
    - _Requirements: 3.2, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 17.1, 17.2_

  - [x] 1.3 Create migration for task_client_responses table
    - Create `task_client_responses` table with columns: id, task_id, client_id, required_item, file_url, is_completed, comment, created_at, updated_at, deleted_at
    - Add foreign keys to project_tasks and contacts
    - Add composite index on (task_id, client_id) and index on is_completed
    - File: `Pylott-Backend/migrations/YYYYMMDD_create_task_client_responses.ts`
    - _Requirements: 5.5, 9.1, 17.1_

- [x] 2. Backend models and types for new tables
  - [x] 2.1 Create TaskClientAssignees Objection.js model
    - Define model class extending BaseModel with tableName, jsonSchema, and relationMappings
    - Add relations to ProjectTask, Contact, Project, Company
    - File: `Pylott-Backend/src/shared/models/task-client-assignees.model.ts` (or follow existing model location pattern)
    - _Requirements: 3.2, 9.1_

  - [x] 2.2 Create TaskClientResponses Objection.js model
    - Define model class with tableName, jsonSchema, and relationMappings
    - Add relations to ProjectTask and Contact
    - File: `Pylott-Backend/src/shared/models/task-client-responses.model.ts`
    - _Requirements: 5.2, 5.5_

  - [x] 2.3 Update ProjectTask model with new fields and relations
    - Add task_category, required_information, additional_info to jsonSchema
    - Add TaskCategory enum type ('internal' | 'external')
    - Add relationMappings for taskClientAssignees and taskClientResponses
    - _Requirements: 1.1, 1.3, 11.1, 11.3, 11.4, 11.5_

  - [x] 2.4 Add shared TypeScript types and enums for task categories
    - Create TaskCategory enum, CreateTaskRequest interface, ValidationResult interface
    - Add types for InternalTaskData, ExternalTaskData, CreateTaskRequestBody
    - File: `Pylott-Backend/src/shared/types/task.types.ts` (or extend existing types)
    - _Requirements: 1.1, 11.1, 13.1, 13.2, 13.3, 13.4_

- [x] 3. Backend validation service
  - [x] 3.1 Create TaskValidationService with role-based and project-scoped validation
    - Implement `validateTaskCategory()` to check valid enum values
    - Implement `validateInternalAssignees()` to verify users have ADMIN/CONSULTANT/SUPER_ADMIN roles
    - Implement `validateExternalAssignees()` to verify clients exist in project.form_data.project_client
    - Implement `validateRequiredInformation()` for external task required items
    - File: `Pylott-Backend/src/modules/projects/services/task-validation.service.ts`
    - _Requirements: 2.3, 3.4, 4.2, 4.3, 4.4, 6.2, 7.1, 7.2, 7.3, 7.4, 7.5, 16.1, 16.2, 16.3_

  - [ ]* 3.2 Write unit tests for TaskValidationService
    - Test validateInternalAssignees with valid admin users, invalid client users, non-existent users
    - Test validateExternalAssignees with project-associated clients, non-associated clients, missing contacts
    - Test validateRequiredInformation with valid items, empty items
    - _Requirements: 2.3, 3.4, 4.2, 7.1, 7.2_

- [ ] 4. Checkpoint - Ensure migrations run and validation service works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Extend TaskService with internal and external task creation
  - [x] 5.1 Implement createInternalTask method in TaskService
    - Accept InternalTaskData, validate assignees via TaskValidationService
    - Insert task with task_category='internal', additional_info JSON, and assignees into project_task_assignees
    - Handle attachments via existing Cloudinary pattern
    - Trigger email notifications and in-app notifications for assignees
    - Follow existing transaction pattern from createTask method
    - _Requirements: 1.1, 2.1, 2.2, 2.4, 2.5, 5.6, 10.3, 13.1, 13.2, 13.5, 15.1_

  - [x] 5.2 Implement createExternalTask method in TaskService
    - Accept ExternalTaskData, validate client assignees via TaskValidationService
    - Insert task with task_category='external', required_information JSON
    - Insert client assignees into task_client_assignees table
    - Create response placeholder records in task_client_responses for each client × required item
    - Send email notifications to client contacts via SendGrid
    - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.5, 5.1, 5.2, 13.1, 13.3, 13.4, 13.6, 15.2, 15.5_

  - [x] 5.3 Implement getProjectClients endpoint logic
    - Query projects.form_data.project_client to get client IDs
    - Join with contacts table to get full client details (name, email, organization)
    - Filter to only active (non-deleted) contacts
    - _Requirements: 4.1, 4.4, 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 5.4 Implement getAvailableAssignees endpoint logic
    - For internal: return users with role IN ('ADMIN', 'CONSULTANT', 'SUPER_ADMIN') in the company
    - For external: return contacts from project.form_data.project_client
    - _Requirements: 2.1, 3.1, 14.1, 14.5_

  - [x] 5.5 Update getAllTask and getTaskById to include task_category and related data
    - Include task_category in task responses
    - For internal tasks: include assignees from project_task_assignees
    - For external tasks: include client assignees from task_client_assignees and client responses
    - Apply role-based query filtering (CLIENT users see only their assigned external tasks)
    - _Requirements: 10.4, 11.2, 11.3, 11.4, 11.5, 18.1, 18.2, 18.3, 18.5_

  - [x] 5.6 Implement updateClientTaskProgress method
    - Accept client responses (required_item, file_url, is_completed, comment)
    - Validate requesting client is assigned to the task
    - Upsert records in task_client_responses table
    - Calculate and return completion percentage
    - _Requirements: 5.5, 12.3_

  - [ ]* 5.7 Write unit tests for TaskService internal/external task creation
    - Test createInternalTask with valid assignees, invalid assignees, attachments
    - Test createExternalTask with valid clients, response placeholder creation
    - Test getProjectClients returns correct filtered contacts
    - Test updateClientTaskProgress updates responses correctly
    - _Requirements: 2.2, 3.2, 5.2, 13.5, 13.6_

- [x] 6. Backend routes and controller updates
  - [x] 6.1 Update TaskController to handle task_category in create/update endpoints
    - Parse taskCategory from request body in createTask
    - Route to createInternalTask or createExternalTask based on category
    - Add input sanitization for name, description, requiredInformation, additionalInfo
    - Return validation errors with HTTP 400 and descriptive messages
    - _Requirements: 13.1, 13.7, 16.1, 16.4, 16.5_

  - [x] 6.2 Add new API routes for available assignees and client responses
    - GET `/api/v1/projects/:projectId/available-assignees?category=internal|external`
    - POST `/api/v1/tasks/:taskId/client-response` for client task progress updates
    - Add authorization middleware: only assigned clients can update responses
    - _Requirements: 13.1, 14.1, 18.1, 18.4_

  - [x] 6.3 Add authorization middleware for task access control
    - Admin/Super Admin: access all tasks
    - Consultant: access internal tasks
    - Client: view only external tasks assigned to them
    - Verify project membership before returning task details
    - _Requirements: 6.4, 18.1, 18.2, 18.3, 18.4_

- [x] 7. Email notification templates for task types
  - [x] 7.1 Create internal task assignment email template and send function
    - Template includes: assignee name, task name, project name, due date, additional info, task link
    - Use existing SendGrid email pattern from `Pylott-Backend/src/shared/utils/email.ts`
    - _Requirements: 15.1, 15.3_

  - [x] 7.2 Create external task assignment email template and send function
    - Template includes: client name, task name, project name, due date, required information list, task link, description
    - Subject line: "Action Required: [Task Name]"
    - _Requirements: 15.2, 15.4, 15.5_

- [ ] 8. Checkpoint - Ensure backend API works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Frontend types and API hooks
  - [x] 9.1 Add frontend TypeScript types for task categories
    - TaskCategory enum, InternalTaskFormData, ExternalTaskFormData interfaces
    - ClientOption, UserOption, ClientResponseItem interfaces
    - CreateTaskRequest, TaskListItem with taskCategory field
    - File: `Pylott-Web-App/src/types/task.types.ts` (or extend existing types)
    - _Requirements: 1.1, 11.1_

  - [x] 9.2 Create TanStack Query hooks for new task endpoints
    - `useAvailableAssignees(projectId, category)` - fetches internal users or project clients
    - `useCreateTask()` mutation - posts task with taskCategory
    - `useUpdateClientResponse(taskId)` mutation - posts client response updates
    - Follow existing query hook patterns in the codebase
    - _Requirements: 13.1, 14.1_

- [x] 10. Frontend TaskTypeSelectorPage component
  - [x] 10.1 Create TaskTypeSelectorPage with Internal/External task options
    - Display two card options: "Internal Task" (team icon, description) and "External Task" (client icon, description)
    - Validate selection before enabling Next button
    - Handle navigation: Next goes to appropriate form, Cancel returns to task list
    - Use Tailwind CSS for styling, follow existing page patterns
    - File: `Pylott-Web-App/src/pages/Home/Task/task-type-selector.tsx`
    - _Requirements: 1.2, 8.1, 8.2, 8.3, 8.6, 20.1_

- [x] 11. Frontend InternalTaskForm component
  - [x] 11.1 Create InternalTaskForm with assignee dropdown and additional info
    - Fetch admin/consultant users via useAvailableAssignees hook
    - Multi-select assignee dropdown filtered to ADMIN/CONSULTANT/SUPER_ADMIN roles
    - Task type dropdown (existing metadata), optional task name, description, due date
    - Dynamic additional info list (add/remove free-text items)
    - File attachment support via existing Cloudinary upload pattern
    - Yup validation schema: assignees required, due date required
    - File: `Pylott-Web-App/src/pages/Home/Task/internal-task-form.tsx`
    - _Requirements: 2.1, 5.6, 8.4, 20.2, 20.5, 20.6_

- [x] 12. Frontend ExternalTaskForm component
  - [x] 12.1 Create ExternalTaskForm with client dropdown and required information
    - Fetch project clients via useAvailableAssignees hook with category='external'
    - Multi-select client dropdown showing only project-associated contacts
    - Required task name, description, due date fields
    - Dynamic required information list (add/remove free-text items, minimum 1 item)
    - Yup validation schema: name required, clients required, required info required, due date required
    - File: `Pylott-Web-App/src/pages/Home/Task/external-task-form.tsx`
    - _Requirements: 3.1, 5.1, 5.3, 5.4, 8.5, 19.1, 19.2, 19.5, 20.3, 20.4, 20.5, 20.6_

- [ ] 13. Checkpoint - Ensure frontend forms render and validate correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Frontend ClientTaskView component
  - [x] 14.1 Create ClientTaskView for clients to view and complete external tasks
    - Display task details: name, project, due date, description
    - Render required information as a checklist with file upload per item
    - Allow clients to mark items as completed, upload files, add comments
    - Show completion progress (X of Y items completed, percentage)
    - Save Progress and Mark as Complete buttons
    - File: `Pylott-Web-App/src/pages/client/tasks/client-task-view.tsx`
    - _Requirements: 5.5, 19.5, 19.6_

- [x] 15. Frontend routing and navigation wiring
  - [x] 15.1 Update routing to integrate task creation wizard flow
    - Add route for TaskTypeSelectorPage at `/projects/:projectId/tasks/new`
    - Add route for InternalTaskForm at `/projects/:projectId/tasks/new/internal`
    - Add route for ExternalTaskForm at `/projects/:projectId/tasks/new/external`
    - Add route for ClientTaskView at `/client/tasks/:taskId` or `/tasks/:taskId/complete`
    - Update "Add Task" button in task list to navigate to TaskTypeSelectorPage instead of opening modal
    - _Requirements: 8.1, 8.3_

  - [x] 15.2 Update task list to display task_category and handle both task types
    - Show task category badge (Internal/External) in task table rows
    - For external tasks, show client assignees instead of user assignees
    - Show completion percentage for external tasks
    - Ensure backward compatibility: existing tasks display as Internal
    - _Requirements: 10.2, 10.4, 10.5, 11.2_

- [x] 16. Wire frontend forms to backend API and handle responses
  - [x] 16.1 Connect InternalTaskForm submission to createTask API
    - Submit form data with taskCategory='internal' via useCreateTask mutation
    - Handle success: navigate back to task list, show success toast
    - Handle errors: display inline validation errors from backend
    - _Requirements: 13.1, 13.2, 13.5, 16.1_

  - [x] 16.2 Connect ExternalTaskForm submission to createTask API
    - Submit form data with taskCategory='external' via useCreateTask mutation
    - Handle success: navigate back to task list, show success toast
    - Handle errors: display inline validation errors from backend
    - _Requirements: 13.1, 13.3, 13.4, 13.6, 16.1, 16.2_

  - [x] 16.3 Connect ClientTaskView to client-response API
    - Submit response updates via useUpdateClientResponse mutation
    - Handle file uploads to Cloudinary before submitting response
    - Update completion progress in real-time
    - _Requirements: 5.5, 12.3_

- [ ] 17. Final checkpoint - Ensure full integration works
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key integration points
- The existing `createTask` method in TaskService should remain functional for backward compatibility (Requirement 10)
- Email templates follow the existing SendGrid pattern in `Pylott-Backend/src/shared/utils/email.ts`
- Frontend components follow existing patterns in `Pylott-Web-App/src/pages/Home/Task/`
