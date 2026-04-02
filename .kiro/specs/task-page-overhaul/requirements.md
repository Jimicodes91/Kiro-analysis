# Requirements Document

## Introduction

The Pylott platform's task page is being overhauled to simplify the task creation flow, streamline the internal task form to essential fields only, support standalone tasks (not tied to a project), redesign the task list table with status-based row coloring, and enable a detail view with category and comments when clicking a task row. The backend must also be updated to make project association optional.

## Glossary

- **Task_Page**: The main task listing page at `/task` (index.tsx) that displays all tasks and provides access to task creation.
- **Internal_Task_Form**: The form component (internal-task-form.tsx) used to create internal tasks with fields for assignee, name, category, status, and due date.
- **Task_List_Table**: The table component (task-table.tsx / task-table-row.tsx) that renders all tasks in a tabular format with sortable columns.
- **Task_Detail_View**: The modal or panel that opens when a user clicks a task row, showing the task's category and notes/comments.
- **Task_Type_Selector**: The intermediate page (task-type-selector.tsx) that currently asks users to choose between Internal and External task types before reaching the form.
- **Category**: A classification for internal tasks limited to four values: Review, Approval, Meeting, Follow-up.
- **Standalone_Task**: A task created without association to any pipeline or project (project_id and project_type_id are null).
- **Task_API**: The backend endpoint responsible for creating tasks, located in the Pylott-Backend service.
- **Status**: The lifecycle state of a task; one of Draft, Sent, In Progress, Completed, or Archived.

## Requirements

### Requirement 1: Simplified Internal Task Form

**User Story:** As a team member, I want a simplified task creation form with only essential fields, so that I can create tasks quickly without unnecessary complexity.

#### Acceptance Criteria

1. THE Internal_Task_Form SHALL display only the following fields: Assignee, Task name, Category, Status, and Due date.
2. THE Internal_Task_Form SHALL provide a Category selector limited to four options: Review, Approval, Meeting, and Follow-up.
3. THE Internal_Task_Form SHALL NOT display the Description, Start date, Additional info, Attachment, or type-specific fields sections.
4. THE Internal_Task_Form SHALL display Pipeline and Project as optional fields that accept null values for Standalone_Task creation.
5. WHEN Pipeline and Project are left empty, THE Internal_Task_Form SHALL submit the task with null values for project_id and project_type_id.
6. WHEN a Pipeline is selected, THE Internal_Task_Form SHALL enable the Project selector filtered to that pipeline's projects.

### Requirement 2: Direct Task Creation Navigation

**User Story:** As a team member, I want the "Add task" button to go directly to the task form, so that I can start creating a task without an extra selection step.

#### Acceptance Criteria

1. WHEN the user clicks the "Add task" button on the Task_Page, THE Task_Page SHALL navigate directly to the Internal_Task_Form.
2. THE Task_Page SHALL NOT display or navigate to the Task_Type_Selector page.
3. WHEN navigating from a project context with projectId and projectTypeId parameters, THE Task_Page SHALL pass those parameters to the Internal_Task_Form.

### Requirement 3: Redesigned Task List Table

**User Story:** As a team member, I want the task list to show relevant columns with status-based color coding, so that I can quickly scan and identify task states.

#### Acceptance Criteria

1. THE Task_List_Table SHALL display the following columns in order: Date, Task Name, Due Date, Pipeline, Project, Status.
2. WHILE a task has a status of "in_progress", THE Task_List_Table SHALL render that row with an amber-tinted background.
3. WHILE a task has a status of "completed", THE Task_List_Table SHALL render that row with a green-tinted background.
4. WHILE a task has a status of "archived", THE Task_List_Table SHALL render that row with a slate-tinted background.
5. WHILE a task has a status of "draft" or "sent", THE Task_List_Table SHALL render that row with the default background (no tint).
6. THE Task_List_Table SHALL NOT display the Type or Assigned columns from the previous layout.

### Requirement 4: Task Row Click Opens Detail View

**User Story:** As a team member, I want to click a task row to see its details including category and comments, so that I can review task information without navigating away.

#### Acceptance Criteria

1. WHEN the user clicks a task row in the Task_List_Table, THE Task_Detail_View SHALL open displaying the task's category and notes/comments section.
2. THE Task_Detail_View SHALL display the task category (Review, Approval, Meeting, or Follow-up).
3. THE Task_Detail_View SHALL display the existing comments/notes for the task using the TaskComments component.
4. THE Task_Detail_View SHALL allow the user to add new comments to the task.

### Requirement 5: Backend Optional Project Association

**User Story:** As a team member, I want to create standalone tasks without selecting a project, so that I can track work that is not tied to a specific project.

#### Acceptance Criteria

1. THE Task_API SHALL accept task creation requests where project_id is null.
2. THE Task_API SHALL accept task creation requests where project_type_id is null.
3. WHEN project_id is null, THE Task_API SHALL create the task as a Standalone_Task without project association.
4. WHEN project_id is provided, THE Task_API SHALL validate that the project exists before creating the task.
5. IF project_id is provided but does not reference a valid project, THEN THE Task_API SHALL return a descriptive error response.
