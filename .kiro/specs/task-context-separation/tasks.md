# Implementation Plan: Task Context Separation

## Overview

Separate task creation and display into organization-level (standalone) and project-bound contexts. Backend changes first (context query filter, metrics), then frontend form cleanup, then Tasks page context filter UI, then integration wiring.

## Tasks

- [x] 1. Backend — Add context query parameter to task endpoint
  - [x] 1.1 Update task service to accept and apply context filter
    - In `Pylott-Backend/src/modules/projects/services/task.service.ts`, modify the `getAllTask` method to read a `context` parameter from the query object
    - When `context === "organization"`, add `.whereNull("project_id")` to the Knex query
    - When `context === "project"`, add `.whereNotNull("project_id")` to the Knex query
    - When `context` is absent or any other value, apply no additional filter
    - Ensure the context filter composes with existing status, category_type, and search filters
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 1.2 Update projects controller to pass context parameter
    - In `Pylott-Backend/src/modules/projects/projects.controller.ts`, extract `context` from `req.query` in the `getAllTasks` handler
    - Pass `context` through to `TaskService.getAllTask`
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 1.3 Write property test for context filter correctness
    - **Property 2: Context filter returns correct task subset**
    - Generate arrays of task objects with random `project_id` values (some null, some set)
    - For each context filter value, apply the filter logic and assert the result contains exactly the matching tasks
    - Assert composition with status and category_type filters produces the intersection
    - **Validates: Requirements 5.2, 5.3, 5.6, 6.1, 6.2, 6.3, 6.4**

- [x] 2. Backend — Extend metrics endpoint for context separation
  - [x] 2.1 Add context-separated task count methods to repository/service
    - In `Pylott-Backend/src/modules/projects/services/metrics.service.ts`, extend `getDashboardMetrics` to return a `ContextualTaskReport` structure
    - Add queries for: standalone task status counts (`project_id IS NULL`), project task status counts (`project_id IS NOT NULL`), project task counts by category (internal/external), project task counts grouped by project_id
    - Keep the existing `all` counts for backward compatibility
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 2.2 Write property test for metrics consistency
    - **Property 4: Metrics counts are consistent with task data**
    - Generate arrays of task objects with random project_id and task_category
    - Assert: standalone + project = total for each status
    - Assert: internal + external = project total for each status
    - Assert: sum of per-project counts = project total for each status
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

- [x] 3. Checkpoint — Backend changes verified
  - Ensure all backend changes compile and tests pass, ask the user if questions arise.

- [x] 4. Frontend — Remove pipeline/project selectors from Internal Task Form
  - [x] 4.1 Remove Pipeline and Project selector fields from InternalTaskForm
    - In `Pylott-Web-App/src/pages/Home/Task/internal-task-form.tsx`, remove the `project_type_id` (Pipeline) `<FormField>` and its `<Select>` component
    - Remove the `project_id` (Project) `<FormField>` and its `<Select>` component
    - Remove imports for `useGetAllProjectTypes` and `useGetAllProjects` if no longer used elsewhere in the file
    - Keep reading `projectId` and `projectTypeId` from `useSearchParams()` — these auto-assign to the payload
    - Keep the existing standalone vs project-bound submission logic unchanged
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 4.2 Write property test for query parameter auto-assignment
    - **Property 1: Query parameters auto-assigned to task payload**
    - Generate arbitrary UUID pairs for projectId and projectTypeId
    - Simulate opening the form with those query params and assert the submission payload contains those exact values
    - Assert no Pipeline/Project selector elements are rendered
    - **Validates: Requirements 1.2, 1.5**

- [x] 5. Frontend — External Task Form redirect guard and selector removal
  - [x] 5.1 Add redirect guard to ExternalTaskForm
    - In `Pylott-Web-App/src/pages/Home/Task/external-task-form.tsx`, add a `useEffect` that checks `initialProjectId` and `initialProjectTypeId` on mount
    - If either is missing, call `navigate("/task", { replace: true })` and return `null` from the component
    - Remove any `project_type_id` / `project_id` visible selector fields if present
    - Ensure the form auto-pulls clients using `useAvailableAssignees(selectedProjectId, "external")` from the projectId query param
    - _Requirements: 2.1, 2.2, 2.3, 4.1, 1.4, 1.5_

  - [ ]* 5.2 Write property test for external form redirect
    - **Property 5: External form redirects without project context**
    - Generate combinations of present/absent projectId and projectTypeId where at least one is missing
    - Assert the form triggers a redirect to `/task`
    - **Validates: Requirements 2.2**

  - [ ]* 5.3 Write property test for external form client auto-pull
    - **Property 6: External form auto-pulls clients from projectId**
    - Generate arbitrary valid projectId UUIDs
    - Assert the form calls the assignees endpoint with that projectId and category "external"
    - **Validates: Requirements 2.3**

- [x] 6. Frontend — Tasks page navigation and context filter
  - [x] 6.1 Update Tasks page "Add task" button to navigate directly to internal form
    - In `Pylott-Web-App/src/pages/Home/Task/index.tsx`, ensure the "Add task" button navigates to `/task/new/internal` with no query parameters
    - Remove any navigation to the Type Selector from the Tasks page
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 6.2 Add context filter tabs to Tasks page
    - In `Pylott-Web-App/src/pages/Home/Task/index.tsx`, add a `contextFilter` state: `useState<"all" | "organization" | "project">("all")`
    - Render a segmented button group with three options: "All Tasks", "Organization Tasks", "Project Tasks"
    - Default to `"all"` on initial load
    - Pass `contextFilter` to `<TasksTable>` as a new prop
    - Ensure the context filter works in combination with existing status and type filters
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6_

  - [ ]* 6.3 Write property test for type selector query parameter forwarding
    - **Property 3: Type selector forwards query parameters to target form**
    - Generate arbitrary UUID pairs and task type selections (Internal/External)
    - Assert the constructed navigation URL contains both UUIDs as query params and targets the correct form path
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 7. Frontend — TasksTable and TaskTableRow context support
  - [x] 7.1 Update useGetAllTasks hook to accept context parameter
    - In `Pylott-Web-App/src/hooks/project-modules/tasks/use-get-all-tasks.tsx`, add an optional `context` parameter
    - Update the endpoint URL construction to append `&context={context}` when provided
    - Include `context` in the React Query key for proper cache separation
    - Update `ENDPOINTS.GET_ALL_TASKS` in `Pylott-Web-App/src/lib/constants.ts` to accept an optional context parameter
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 7.2 Update TasksTable to pass context filter and show conditional Category column
    - In `Pylott-Web-App/src/pages/Home/Task/task-table.tsx`, accept a new `contextFilter` prop
    - Pass the context value to `useGetAllTasks` when not `"all"`
    - When `contextFilter === "project"`, add a "Category" column header between "Task Name" and "Due Date"
    - Pass `showCategory` prop to each `<TaskTableRow>`
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 7.3 Update TaskTableRow to render conditional Category cell
    - In `Pylott-Web-App/src/pages/Home/Task/task-table-row.tsx`, accept a new `showCategory` prop
    - When `showCategory` is true, render an additional `<TableCell>` showing "Internal" or "External" based on `task.task_category`
    - _Requirements: 5.4_

- [x] 8. Frontend — Ensure Task_Page does not expose External form navigation
  - - In `Pylott-Web-App/src/pages/Home/Task/index.tsx`, verify and ensure there is no navigation path from the Tasks page to the External_Task_Form or the Type_Selector
    - The "Add task" button must go directly to `/task/new/internal`
    - _Requirements: 2.4, 3.1, 3.2_

- [x] 9. Final checkpoint — Full integration verification
  - Ensure all tests pass, ask the user if questions arise.
  - Verify: standalone task creation from Tasks page, project task creation from Project Detail, external form redirect without project context, context filter tabs filter correctly, Category column appears only for project tasks, metrics endpoint returns context-separated counts.
