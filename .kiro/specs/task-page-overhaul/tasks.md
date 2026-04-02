# Implementation Plan: Task Page Overhaul

## Overview

Overhaul the Pylott task page across frontend (React/TypeScript) and backend (Node.js/TypeScript with Knex). Work proceeds bottom-up: backend schema and API changes first, then frontend form simplification, navigation, table redesign, and detail panel. Each step builds incrementally so nothing is orphaned.

## Tasks

- [x] 1. Backend: Make project association optional
  - [x] 1.1 Create database migration to make `project_id` and `project_type_id` nullable on `project_tasks` table
    - Create a new Knex migration file in `Pylott-Backend/migrations/`
    - Use `ALTER TABLE project_tasks ALTER COLUMN project_id DROP NOT NULL` and same for `project_type_id`
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 1.2 Add standalone task creation validation rules
    - In `Pylott-Backend/src/shared/validations/projects.ts`, create `createStandaloneTaskValidationRules` that makes `project_id` and `project_type_id` optional
    - Keep existing `createTaskValidationRules` unchanged
    - _Requirements: 5.1, 5.2_

  - [x] 1.3 Implement `createStandaloneTask` method in TaskService
    - In `Pylott-Backend/src/modules/projects/services/task.service.ts`, add `createStandaloneTask(user, payload)` method
    - Sets `project_id = null` and `project_type_id = null` on the task record
    - Skips project validation, document creation, and project-specific email links
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 1.4 Add `POST /projects/tasks` route for standalone task creation
    - In `Pylott-Backend/src/modules/projects/projects.route.ts` (or `project.route.ts`), add the new route
    - Wire it to the controller method that calls `TaskService.createStandaloneTask`
    - Apply `createStandaloneTaskValidationRules` middleware
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 1.5 Add project existence validation for project-bound task creation
    - In the existing `createTask` method, ensure that when `project_id` is provided, the project is validated to exist
    - Return a 404 with descriptive error message containing "project" if not found
    - _Requirements: 5.4, 5.5_

  - [ ]* 1.6 Write property test: API accepts standalone task creation with null project fields
    - **Property 5: API accepts standalone task creation with null project fields**
    - Generate arbitrary valid standalone task payloads with null project fields
    - Assert the service method returns success
    - **Validates: Requirements 5.1, 5.2**

  - [ ]* 1.7 Write property test: Invalid project_id returns descriptive error
    - **Property 7: Invalid project_id returns descriptive error**
    - Generate arbitrary UUIDs not in the project table
    - Assert the API returns 404 with message containing "project"
    - **Validates: Requirements 5.4, 5.5**

- [x] 2. Null-Safety: Update TypeScript types and standalone API routes
  - [x] 2.1 Update `Task` interface in `task.types.ts` for nullable project fields
    - Change `project_id: string` → `project_id: string | null`
    - Change `project_type_id: string` → `project_type_id: string | null`
    - Change `project: { ... }` → `project: { ... } | null`
    - Change `InternalTaskFormData.project_type_id: string` → `project_type_id?: string`
    - _Design: 7a — Without this, any code accessing task.project.name crashes for standalone tasks_

  - [x] 2.2 Add standalone comment/activity backend routes
    - Add `GET /tasks/:task_id/comments`, `POST /tasks/:task_id/comments`, `DELETE /tasks/:task_id/comments/:comment_id` routes in backend
    - These routes work without a project_id in the URL path
    - _Design: 7b — Current comment endpoints embed projectId in URL, producing invalid paths for standalone tasks_

  - [x] 2.3 Add standalone comment endpoint constants and update hooks
    - In `src/lib/constants.ts`, add `GET_STANDALONE_TASK_COMMENTS(taskId)`, `ADD_STANDALONE_TASK_COMMENT(taskId)`, `DELETE_STANDALONE_TASK_COMMENT(taskId, commentId)` endpoints
    - Update `use-task-comments.tsx` hooks to check if `projectId` is truthy; if not, use standalone endpoints
    - _Design: 7b_

  - [x] 2.4 Handle assignee fetching without a project
    - In `internal-task-form.tsx`, when no project is selected, fall back to fetching all company users via `useGetCompanyUsers` instead of `useAvailableAssignees`
    - _Design: 7c — useAvailableAssignees returns nothing when projectId is empty_

  - [x] 2.5 Handle standalone task email notifications in backend
    - In `createStandaloneTask` method, use "Standalone Task" as project name placeholder in emails
    - Construct `taskLink` as `/task` instead of `/projects/${project_id}/tasks/${task_id}`
    - Skip document creation entirely
    - _Design: 7d — createTask accesses project.name which is null for standalone tasks_

  - [x] 2.6 Add standalone task delete route and update frontend
    - Backend: Add `DELETE /tasks/:task_id` route that handles deletion without project_id
    - Frontend: Update `DeleteTaskModal` and `useDeleteTask` to handle null `projectId` by switching to standalone endpoint
    - _Design: 7e — DeleteTaskModal passes task.project_id to useDeleteTask, producing invalid URLs for standalone tasks_

- [x] 3. Checkpoint - Backend and null-safety changes verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Frontend: Simplify Internal Task Form
  - [x] 4.1 Remove unnecessary fields from `InternalTaskForm`
    - In `src/pages/Home/Task/internal-task-form.tsx`, remove the Description, Start date, Additional info, Attachment, and `TypeFieldsSection` fields/sections
    - Ensure the form renders only: Assignee, Task name, Category, Status, Due date, Pipeline (optional), Project (optional)
    - _Requirements: 1.1, 1.3_

  - [x] 4.2 Limit Category selector to four options
    - In `internal-task-form.tsx`, update the category options to only include: Review, Approval, Meeting, Follow-up
    - Remove Signing, Information Request, Document Upload from the category list
    - _Requirements: 1.2_

  - [x] 4.3 Make Pipeline and Project fields optional
    - Remove `isRequired` from Pipeline and Project selectors
    - Allow null submission for both fields
    - When Pipeline is selected, enable the Project selector filtered to that pipeline's projects
    - When Pipeline is empty, disable or hide the Project selector
    - _Requirements: 1.4, 1.5, 1.6_

  - [x] 4.4 Create `useCreateStandaloneTask` hook
    - Create `src/hooks/project-modules/tasks/use-create-standalone-task.tsx`
    - Hook calls `POST /projects/tasks` for standalone task creation
    - Invalidates `GET_ALL_TASKS` query on success
    - _Requirements: 1.5, 5.1_

  - [x] 4.5 Wire form submission to use standalone or project-bound endpoint
    - In `internal-task-form.tsx`, when Pipeline/Project are empty, call `useCreateStandaloneTask`
    - When Pipeline/Project are selected, use the existing `useCreateTask` hook
    - Update `backPath` to navigate to `/task` instead of `/task/new`
    - _Requirements: 1.4, 1.5_

  - [ ]* 4.6 Write property test: Empty pipeline/project produces null payload fields
    - **Property 1: Empty pipeline/project produces null payload fields**
    - Generate arbitrary valid form data with empty pipeline/project
    - Assert the transformed payload has `project_id = null` and `project_type_id = null`
    - **Validates: Requirements 1.4, 1.5**

- [x] 5. Frontend: Direct Task Creation Navigation
  - [x] 5.1 Update "Add task" button navigation on Task Page
    - In `src/pages/Home/Task/index.tsx`, change the "Add task" button `onClick` from `navigate("/task/new")` to `navigate("/task/new/internal")`
    - _Requirements: 2.1, 2.2_

  - [x] 5.2 Update route configuration to bypass TaskTypeSelectorPage
    - In `src/routes/app.tsx`, change the `/task/new` route to render `InternalTaskForm` directly instead of `TaskTypeSelectorPage`
    - Keep `/task/new/internal` route for backward compatibility
    - _Requirements: 2.1, 2.2_

  - [x] 5.3 Forward project context parameters when navigating from a project
    - Ensure that when navigating from a project context with `projectId` and `projectTypeId`, those parameters are passed as query string values to the form URL
    - _Requirements: 2.3_

  - [ ]* 5.4 Write property test: Project context parameters forwarded to form
    - **Property 3: Project context parameters forwarded to form**
    - Generate arbitrary UUID pairs for projectId and projectTypeId
    - Assert the constructed navigation URL contains both as query parameters
    - **Validates: Requirements 2.3**

- [x] 6. Checkpoint - Form and navigation verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Frontend: Redesign Task List Table
  - [x] 7.1 Update table columns in `TasksTable`
    - In `src/pages/Home/Task/task-table.tsx`, update column headers to: Date, Task Name, Due Date, Pipeline, Project, Status
    - Remove Type, Assigned, and actions columns
    - _Requirements: 3.1, 3.6_

  - [x] 7.2 Implement status-based row coloring in `TaskTableRow`
    - In `src/pages/Home/Task/task-table-row.tsx`, apply background CSS classes based on task status:
      - `in_progress` → `bg-amber-50`
      - `completed` → `bg-green-50`
      - `archived` → `bg-slate-100`
      - `draft` / `sent` → default (no tint)
    - Render columns: `created_at`, `name`, `end_date`, pipeline name, project name (or "—" for standalone), status badge
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [x] 7.3 Add row click handler to open TaskDetailPanel
    - In `task-table-row.tsx`, add `onClick` handler on the `<TableRow>` element
    - Remove the existing dropdown menu (View/Edit/Delete actions)
    - Handle null `project` gracefully for standalone tasks (display "—")
    - _Requirements: 3.6, 4.1_

  - [ ]* 7.4 Write property test: Status-to-row-color mapping
    - **Property 2: Status-to-row-color mapping**
    - Generate arbitrary task status values from {draft, sent, in_progress, completed, archived}
    - Assert `getStatusRowColor(status)` returns the correct CSS class
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**

- [x] 8. Frontend: Task Detail Panel and Comments
  - [x] 8.1 Create `TaskDetailPanel` component
    - Create `src/pages/Home/Task/task-detail-panel.tsx`
    - Accept props: `isOpen`, `onClose`, `task`
    - Render task name as header, category badge (Review, Approval, Meeting, Follow-up), and `TaskComments` component
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 8.2 Update `TaskComments` to handle standalone tasks
    - In `src/pages/Home/Task/task-comments.tsx`, update `TaskCommentsProps` to accept optional `projectId`
    - When `projectId` is null/empty, handle gracefully (use standalone comments endpoint or sentinel value)
    - Ensure comment addition still works for standalone tasks
    - _Requirements: 4.3, 4.4_

  - [x] 8.3 Wire `TaskDetailPanel` into `TasksTable` state management
    - In `task-table.tsx`, add state for selected task and panel open/close
    - Pass the selected task to `TaskDetailPanel` when a row is clicked
    - _Requirements: 4.1_

  - [ ]* 8.4 Write property test: Task detail view displays correct category
    - **Property 4: Task detail view displays correct category**
    - Generate arbitrary task objects with category in {review, approval, meeting, follow_up}
    - Assert the rendered TaskDetailPanel contains the category text
    - **Validates: Requirements 4.2**

- [x] 9. Final checkpoint - Full integration verified
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Task group 2 (null-safety) must be completed alongside task group 1 before any frontend work
- Backend changes (task groups 1-2) must be completed before frontend form submission wiring (task 4.5)
- Property tests use `fast-check` with vitest, minimum 100 iterations per test
- The `TaskTypeSelectorPage` component is no longer referenced in routes but is not deleted (can be cleaned up later)
- Key null-safety risks identified during code audit:
  - `task.project.name` accessed without null check in task-table-row.tsx, edit-task-modal.tsx
  - Comment endpoints embed projectId in URL path — standalone tasks produce invalid URLs
  - `useAvailableAssignees` returns nothing when projectId is empty
  - Backend `createTask` accesses `project.name` in email notifications
  - `DeleteTaskModal` passes `task.project_id` to `useDeleteTask` — invalid for standalone tasks
