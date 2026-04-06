# Requirements Document

## Introduction

The Pylott task management page currently uses a modal-based detail panel (TaskDetailPanel) for viewing task details, status changes, and comments. This approach has usability issues: comments fail to load for project-bound tasks, the status dropdown shows raw values instead of formatted labels, and there is no way to edit task name, due date, or category directly. This spec replaces the modal with inline editing on the task table itself, adds an expandable row pattern for comments, introduces a visible Category column, and adds a general-purpose backend PATCH endpoint for standalone task updates.

## Glossary

- **Task_Table**: The table component (`task-table.tsx`) that renders all tasks in a tabular format with columns for Date, Task Name, Due Date, Pipeline, Project, and Status.
- **Task_Table_Row**: The row component (`task-table-row.tsx`) that renders a single task as a table row within the Task_Table.
- **Task_Detail_Panel**: The existing modal component (`task-detail-panel.tsx`) that opens when a row is clicked, showing status dropdown, category badge, and comments. To be removed.
- **Task_Comments**: The comments component (`task-comments.tsx`) that renders a comment list and input form, supporting both standalone and project-bound tasks via endpoint switching.
- **Task_Page**: The main task listing page at `/task` (`index.tsx`) that hosts the Task_Table, filters, and navigation.
- **Inline_Editor**: An in-place editing control that replaces a read-only cell value with an editable input (text field, date picker, or dropdown) on click, and saves on blur or Enter.
- **Expandable_Row**: A collapsible section rendered below a Task_Table_Row that shows the Task_Comments component when the row is expanded.
- **Task_API**: The backend endpoints responsible for creating, querying, updating, and managing tasks.
- **Standalone_Task**: A task with `project_id = null`, managed via `/tasks/:task_id` routes.
- **Project_Task**: A task with `project_id` set, managed via `/projects/:project_id/tasks/:task_id` routes.
- **General_Update_Endpoint**: A new `PATCH /tasks/:task_id` backend endpoint that accepts partial updates (name, due_date, status, task_category_type) for standalone tasks in a single call.

## Requirements

### Requirement 1: Remove TaskDetailPanel Modal

**User Story:** As a team member, I want the task row click to no longer open a modal popup, so that I can interact with task data directly in the table.

#### Acceptance Criteria

1. THE Task_Page SHALL NOT render the Task_Detail_Panel component.
2. THE Task_Page SHALL NOT maintain `selectedTask` or `detailPanelOpen` state for modal display.
3. WHEN a user clicks a Task_Table_Row, THE Task_Page SHALL NOT open any modal or overlay.

### Requirement 2: Inline Editing — Task Name

**User Story:** As a team member, I want to click on a task name cell to edit it inline, so that I can rename tasks without leaving the table view.

#### Acceptance Criteria

1. WHEN a user clicks the Task Name cell of a Task_Table_Row, THE Task_Table_Row SHALL replace the text display with a text input pre-filled with the current task name.
2. WHEN the user presses Enter or the text input loses focus (blur), THE Task_Table_Row SHALL submit the updated name to the Task_API.
3. WHEN the user presses Escape while editing the Task Name, THE Task_Table_Row SHALL discard changes and revert to the read-only display.
4. WHILE the Task Name update request is in flight, THE Task_Table_Row SHALL display a loading indicator on the cell.
5. IF the Task_API returns an error for the name update, THEN THE Task_Table_Row SHALL revert the cell to the previous value and display a toast notification with the error message.

### Requirement 3: Inline Editing — Due Date

**User Story:** As a team member, I want to click on a due date cell to pick a new date inline, so that I can adjust deadlines quickly.

#### Acceptance Criteria

1. WHEN a user clicks the Due Date cell of a Task_Table_Row, THE Task_Table_Row SHALL display a date picker popover anchored to the cell.
2. WHEN the user selects a date from the date picker, THE date picker SHALL close immediately and THE Task_Table_Row SHALL display the selected date in the cell and submit the updated due date to the Task_API.
3. WHEN the user clicks outside the date picker without selecting a date, THE date picker SHALL close and THE Task_Table_Row SHALL retain the original due date value.
4. IF the Task_API returns an error for the due date update, THEN THE Task_Table_Row SHALL revert the cell to the previous value and display a toast notification with the error message.

### Requirement 4: Inline Editing — Status

**User Story:** As a team member, I want to click on a status cell to change the task status via a dropdown inline, so that I can update task progress without opening a separate panel.

#### Acceptance Criteria

1. WHEN a user clicks the Status cell of a Task_Table_Row, THE Task_Table_Row SHALL display a dropdown populated with all valid task statuses (draft, sent, in_progress, completed, archived) showing formatted labels.
2. WHEN the user selects a status from the dropdown, THE Task_Table_Row SHALL submit the updated status to the Task_API.
3. WHEN the user clicks outside the dropdown without selecting a new status, THE Task_Table_Row SHALL close the dropdown and retain the current status.
4. IF the Task_API returns an error for the status update (including invalid status transitions), THEN THE Task_Table_Row SHALL revert the cell to the previous status and display a toast notification with the error message.

### Requirement 5: Read-Only Columns

**User Story:** As a team member, I want Pipeline and Project columns to remain non-editable, so that task context associations are not accidentally changed from the table.

#### Acceptance Criteria

1. THE Task_Table_Row SHALL render the Pipeline column as read-only text.
2. THE Task_Table_Row SHALL render the Project column as read-only text.
3. WHEN a user clicks the Pipeline or Project cell, THE Task_Table_Row SHALL NOT activate any editing control.

### Requirement 6: Category Column Always Visible

**User Story:** As a team member, I want to see the task category type (e.g., review, approval, meeting) as a column in the table at all times, so that I can quickly identify task types without filtering.

#### Acceptance Criteria

1. THE Task_Table SHALL display a "Category" column showing the `task_category_type` value for each task.
2. THE "Category" column SHALL be visible regardless of the active context filter (all, organization, or project).
3. WHEN a task has no `task_category_type` value, THE Task_Table_Row SHALL display "—" in the Category cell.
4. THE Task_Table_Row SHALL display the `task_category_type` value using a formatted label (e.g., "follow_up" displayed as "Follow-up").

### Requirement 7: Expandable Row for Comments

**User Story:** As a team member, I want to expand a task row to see and add comments below it, so that I can collaborate on tasks without a modal.

#### Acceptance Criteria

1. THE Task_Table_Row SHALL display an expand/collapse toggle control (e.g., chevron icon).
2. WHEN a user clicks the expand toggle on a Task_Table_Row, THE Task_Table SHALL render an Expandable_Row below that row containing the Task_Comments component.
3. WHEN a user clicks the collapse toggle on an expanded Task_Table_Row, THE Task_Table SHALL hide the Expandable_Row.
4. THE Expandable_Row SHALL pass the correct `projectId` (empty string for standalone tasks) and `taskId` to the Task_Comments component.
5. THE Task_Comments component SHALL load comments using the standalone endpoint (`/tasks/:task_id/comments`) when `projectId` is empty, and the project endpoint (`/projects/:project_id/tasks/:task_id/comments`) when `projectId` is set.

### Requirement 8: Backend General Update Endpoint for Standalone Tasks

**User Story:** As a team member, I want a single API endpoint to update task name, due date, status, and category type for standalone tasks, so that inline edits can be saved in one call.

#### Acceptance Criteria

1. THE Task_API SHALL expose a `PATCH /tasks/:task_id` endpoint that accepts a partial update payload containing any combination of `name`, `due_date`, `status`, and `task_category_type`.
2. WHEN the General_Update_Endpoint receives a valid payload, THE Task_API SHALL update only the provided fields on the Standalone_Task.
3. WHEN the General_Update_Endpoint receives a `status` field, THE Task_API SHALL validate the status transition using the existing status transition validator.
4. WHEN the General_Update_Endpoint receives a `name` field, THE Task_API SHALL validate that the name is a non-empty string.
5. IF the task identified by `task_id` does not exist or does not belong to the authenticated user's company, THEN THE Task_API SHALL return a 404 response with message "Task not found".
6. IF the status transition is invalid, THEN THE Task_API SHALL return the transition validation error response.
7. WHEN the status is updated, THE Task_API SHALL log the status change to the activity log and emit a notification.

### Requirement 9: Frontend Update Hook for Inline Edits

**User Story:** As a team member, I want inline edits to save via the correct API endpoint depending on whether the task is standalone or project-bound, so that all tasks can be edited inline regardless of context.

#### Acceptance Criteria

1. WHEN an inline edit is submitted for a Standalone_Task, THE Task_Table_Row SHALL send the update to `PATCH /tasks/:task_id`.
2. WHEN an inline edit is submitted for a Project_Task, THE Task_Table_Row SHALL send the update to `PATCH /projects/:project_id/tasks/:task_id`.
3. WHEN the update succeeds, THE Task_Table_Row SHALL invalidate the task list query cache to reflect the updated data.
4. THE update hook SHALL accept a partial payload containing any combination of `name`, `due_date`, `status`, and `task_category_type`.

### Requirement 10: Fix Comments Loading for Project-Bound Tasks

**User Story:** As a team member, I want comments to load correctly for both standalone and project-bound tasks, so that I can view and add comments on any task.

#### Acceptance Criteria

1. WHEN the Task_Comments component receives a non-empty `projectId`, THE Task_Comments component SHALL fetch comments from `GET /projects/:project_id/tasks/:task_id/comments`.
2. WHEN the Task_Comments component receives an empty `projectId`, THE Task_Comments component SHALL fetch comments from `GET /tasks/:task_id/comments`.
3. WHEN the Task_Comments component creates a comment for a project-bound task, THE Task_Comments component SHALL post to `POST /projects/:project_id/tasks/:task_id/comments`.
4. WHEN the Task_Comments component creates a comment for a standalone task, THE Task_Comments component SHALL post to `POST /tasks/:task_id/comments`.
