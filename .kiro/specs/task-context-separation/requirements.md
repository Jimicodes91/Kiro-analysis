# Requirements Document

## Introduction

The Pylott platform currently allows pipeline and project selectors on both internal and external task forms, and the Tasks page displays all tasks in a flat list without distinguishing between standalone organization-level tasks and project-bound tasks. This spec separates task creation and display contexts: forms no longer expose pipeline/project selectors (context is inherited automatically), external tasks are only creatable from a project, the Tasks page gains filter tabs for Organization vs Project tasks, and the reporting model distinguishes standalone tasks (org-level) from project tasks (per-project, internal vs external).

## Glossary

- **Internal_Task_Form**: The form component (`internal-task-form.tsx`) used to create internal tasks with fields for assignee, name, category, status, and due date.
- **External_Task_Form**: The form component (`external-task-form.tsx`) used to create external (client-facing) tasks with client assignment, category type, and due date.
- **Task_Page**: The main task listing page at `/task` (`index.tsx`) that displays all tasks and provides access to task creation.
- **Task_List_Table**: The table component (`task-table.tsx` / `task-table-row.tsx`) that renders tasks in a tabular format with status-based row coloring.
- **Type_Selector**: The intermediate page (`task-type-selector.tsx`) that asks users to choose between Internal and External task types before reaching the form.
- **Project_Detail_Page**: The project detail view (`project-details/main.tsx`) that shows project info, milestones, and a tasks tab with an "Add Task" button.
- **Standalone_Task**: A task created without association to any project (`project_id = null`), representing an organization-level reminder or follow-up.
- **Project_Task**: A task associated with a specific project (`project_id` is set), categorized as either internal or external.
- **Organization_Tasks_View**: A filtered view of the Task_List_Table showing only Standalone_Tasks (`project_id = null`).
- **Project_Tasks_View**: A filtered view of the Task_List_Table showing only Project_Tasks (`project_id` is set), categorized by internal vs external.
- **Task_API**: The backend endpoints responsible for creating, querying, and managing tasks.
- **Metrics_API**: The backend endpoint that returns dashboard reporting metrics including task counts.

## Requirements

### Requirement 1: Remove Pipeline/Project Selectors from Task Forms

**User Story:** As a team member, I want task forms to automatically inherit project context from navigation rather than requiring manual pipeline/project selection, so that task creation is faster and context errors are eliminated.

#### Acceptance Criteria

1. THE Internal_Task_Form SHALL NOT display Pipeline or Project selector fields.
2. WHEN the Internal_Task_Form is opened with `projectId` and `projectTypeId` query parameters, THE Internal_Task_Form SHALL auto-assign those values to the task payload without displaying selector fields.
3. WHEN the Internal_Task_Form is opened without `projectId` and `projectTypeId` query parameters, THE Internal_Task_Form SHALL create a Standalone_Task with `project_id = null` and `project_type_id = null`.
4. THE External_Task_Form SHALL NOT display Pipeline or Project selector fields.
5. WHEN the External_Task_Form is opened with `projectId` and `projectTypeId` query parameters, THE External_Task_Form SHALL auto-assign those values to the task payload without displaying selector fields.

### Requirement 2: External Task Form Restricted to Project Context

**User Story:** As a team member, I want external tasks to only be creatable from within a project, so that external tasks always have a project and client context.

#### Acceptance Criteria

1. THE External_Task_Form SHALL only be accessible via the Type_Selector from the Project_Detail_Page.
2. WHEN the External_Task_Form is opened without valid `projectId` and `projectTypeId` query parameters, THE External_Task_Form SHALL redirect the user back to the Task_Page.
3. THE External_Task_Form SHALL auto-pull the project's clients for assignment using the `projectId` from query parameters.
4. THE Task_Page SHALL NOT provide any navigation path to the External_Task_Form.

### Requirement 3: Tasks Page Direct Internal Task Creation

**User Story:** As a team member, I want the Tasks page "Add task" button to go directly to the internal task form for standalone task creation, so that I can quickly create organization-level tasks.

#### Acceptance Criteria

1. WHEN the user clicks the "Add task" button on the Task_Page, THE Task_Page SHALL navigate directly to the Internal_Task_Form without query parameters.
2. THE Task_Page SHALL NOT display or navigate to the Type_Selector.
3. THE Internal_Task_Form opened from the Task_Page SHALL create a Standalone_Task.

### Requirement 4: Project Detail Type Selector Flow Preserved

**User Story:** As a team member, I want the project detail "Add Task" button to show the type selector so I can choose between internal and external tasks within the project context.

#### Acceptance Criteria

1. WHEN the user clicks the "Add Task" button on the Project_Detail_Page, THE Project_Detail_Page SHALL navigate to the Type_Selector with `projectId`, `projectTypeId`, and `from` query parameters.
2. WHEN the user selects "Internal" on the Type_Selector, THE Type_Selector SHALL navigate to the Internal_Task_Form with `projectId` and `projectTypeId` query parameters.
3. WHEN the user selects "External" on the Type_Selector, THE Type_Selector SHALL navigate to the External_Task_Form with `projectId` and `projectTypeId` query parameters.

### Requirement 5: Task List Filtering by Context

**User Story:** As a team member, I want to filter the task list between organization tasks and project tasks, so that I can focus on the relevant task context.

#### Acceptance Criteria

1. THE Task_Page SHALL display a context filter with two options: "Organization Tasks" and "Project Tasks".
2. WHEN "Organization Tasks" is selected, THE Task_List_Table SHALL display only Standalone_Tasks where `project_id` is null.
3. WHEN "Project Tasks" is selected, THE Task_List_Table SHALL display only Project_Tasks where `project_id` is set.
4. WHILE "Project Tasks" is selected, THE Task_List_Table SHALL display a "Category" column showing whether each task is internal or external.
5. THE Task_Page SHALL default to showing all tasks (no context filter applied) on initial load.
6. THE context filter SHALL work in combination with the existing status and type filters.

### Requirement 6: Backend Task Querying by Context

**User Story:** As a team member, I want the API to support filtering tasks by context (standalone vs project-bound), so that the frontend can display the correct task subset.

#### Acceptance Criteria

1. WHEN the Task_API receives a query parameter `context=organization`, THE Task_API SHALL return only tasks where `project_id` is null.
2. WHEN the Task_API receives a query parameter `context=project`, THE Task_API SHALL return only tasks where `project_id` is set.
3. WHEN the Task_API receives no `context` query parameter, THE Task_API SHALL return all tasks regardless of project association.
4. THE Task_API context filter SHALL work in combination with existing status, category type, and search filters.

### Requirement 7: Reporting Model Context Separation

**User Story:** As a team member, I want the dashboard reporting to distinguish between organization-level tasks and project-level tasks, so that I can understand task distribution across contexts.

#### Acceptance Criteria

1. THE Metrics_API SHALL return separate task status counts for Standalone_Tasks and Project_Tasks.
2. THE Metrics_API SHALL categorize Project_Task counts by internal vs external task category.
3. THE Metrics_API SHALL report Standalone_Task counts at the organization level.
4. THE Metrics_API SHALL report Project_Task counts grouped by project.
