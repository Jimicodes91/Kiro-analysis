# Implementation Plan: Inline Task Editing

## Overview

Replace the modal-based TaskDetailPanel with inline editing in the task table. Implementation order: backend PATCH endpoint first, then frontend hook, table modifications, modal removal, and expandable comments row.

## Tasks

- [x] 1. Backend — General PATCH endpoint for standalone tasks
  - [x] 1.1 Add `updateStandaloneTask` method to `TaskService` in `task.service.ts`
    - Extend the existing `updateStandaloneTaskStatus` pattern to accept a partial payload `{ name?, due_date?, status?, task_category_type? }`
    - Validate name is non-empty string (trimmed) if provided
    - Validate status transition via `statusTransitionValidator` if status provided
    - Enforce admin-only unarchive if transitioning from archived → completed
    - Update only provided fields via `projectTaskRepository.update()`
    - Log activity and emit notification if status changed
    - Return 404 if task not found or wrong company
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 1.2 Add `updateStandaloneTask` controller method in `projects.controller.ts`
    - Extract `task_id` from params, partial payload from body
    - Call `taskService.updateStandaloneTask(user, task_id, payload)`
    - Return via `genericResponse`
    - _Requirements: 8.1_

  - [x] 1.3 Register `PATCH /tasks/:task_id` route in `task.route.ts`
    - Add `server.patch(\`${prefix}/:task_id\`, authGuard, ...)` route pointing to the new controller method
    - Place it above the existing `/:task_id/status` route to avoid path conflicts
    - _Requirements: 8.1_

  - [ ]* 1.4 Write property test for partial update (Property 8)
    - **Property 8: Backend partial update applies only provided fields**
    - **Validates: Requirements 8.2**

  - [ ]* 1.5 Write property test for status transition validation (Property 9)
    - **Property 9: Backend status transition validation**
    - **Validates: Requirements 8.3, 8.6**

  - [ ]* 1.6 Write property test for name validation (Property 10)
    - **Property 10: Backend name validation rejects empty strings**
    - **Validates: Requirements 8.4**

- [x] 2. Checkpoint — Backend endpoint verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Frontend — `useUpdateTask` hook
  - [x] 3.1 Create `use-update-task.tsx` in `src/hooks/project-modules/tasks/`
    - Accept `projectId: string | null` and `taskId: string`
    - Route to `tasks/${taskId}` for standalone or `projects/${projectId}/tasks/${taskId}` for project-bound
    - Use `useCustomMutation` with method `patch`
    - On success, invalidate `GET_ALL_TASKS` and `GET_ALL_PROJECT_TASKS` query caches
    - Suppress success toast (`showSuccessToast: false`)
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 3.2 Write property test for endpoint routing (Property 6)
    - **Property 6: Update endpoint routing by project_id**
    - **Validates: Requirements 9.1, 9.2**

- [x] 4. Frontend — Remove TaskDetailPanel modal
  - [x] 4.1 Remove modal state and rendering from Task Page `index.tsx`
    - Remove `TaskDetailPanel` import and JSX
    - Remove `selectedTask`, `detailPanelOpen` state variables
    - Remove `handleTaskClick`, `handleDetailPanelClose` functions
    - Remove `onTaskClick` prop from `TasksTable` invocation
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.2 Remove `onTaskClick` prop from `TasksTable` in `task-table.tsx`
    - Remove the prop from the interface and from `TaskTableRow` pass-through
    - _Requirements: 1.3_

  - [x] 4.3 Delete `task-detail-panel.tsx`
    - Remove the file entirely
    - _Requirements: 1.1_

- [x] 5. Frontend — Add Category column to task table
  - [x] 5.1 Add "Category" column header to `TasksTable` in `task-table.tsx`
    - Add column header unconditionally (always visible regardless of context filter)
    - _Requirements: 6.1, 6.2_

  - [x] 5.2 Add Category cell to `TaskTableRow` in `task-table-row.tsx`
    - Display formatted label from `CATEGORY_TYPE_LABELS` map
    - Display "—" when `task_category_type` is null/undefined
    - _Requirements: 6.3, 6.4_

  - [ ]* 5.3 Write property test for category label formatting (Property 5)
    - **Property 5: Category column always visible with formatted label**
    - **Validates: Requirements 6.2, 6.3, 6.4**

- [x] 6. Frontend — Inline editing on TaskTableRow
  - [x] 6.1 Implement inline editing for Task Name cell in `task-table-row.tsx`
    - Use existing `InlineEditable` / `EditableInput` component
    - On Enter/blur: call `useUpdateTask` with `{ name }` payload
    - On Escape: revert to original value
    - Show loading indicator while request is in flight
    - Revert on error (useCustomMutation handles error toast)
    - Use `e.stopPropagation()` on cell click
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 6.2 Implement inline editing for Due Date cell in `task-table-row.tsx`
    - Render a date picker popover anchored to the cell on click
    - On date selection: close picker, call `useUpdateTask` with `{ due_date }`
    - On click outside: close picker, retain original value
    - Revert on error
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 6.3 Implement inline editing for Status cell in `task-table-row.tsx`
    - Render a dropdown with all valid statuses (draft, sent, in_progress, completed, archived) showing formatted labels
    - On selection: call `useUpdateTask` with `{ status }`
    - On click outside: close dropdown, retain current status
    - Revert on error
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.4 Ensure Pipeline and Project columns remain read-only
    - Verify no click handlers or editing controls on Pipeline/Project cells
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 6.5 Write property test for Escape revert (Property 1)
    - **Property 1: Escape reverts inline edit**
    - **Validates: Requirements 2.3**

  - [ ]* 6.6 Write property test for name submit (Property 2)
    - **Property 2: Name submit on Enter/blur**
    - **Validates: Requirements 2.2**

  - [ ]* 6.7 Write property test for date selection (Property 3)
    - **Property 3: Date selection submits update**
    - **Validates: Requirements 3.2**

  - [ ]* 6.8 Write property test for status selection (Property 4)
    - **Property 4: Status selection submits update**
    - **Validates: Requirements 4.2**

- [x] 7. Checkpoint — Inline editing verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Frontend — Expandable row for comments
  - [x] 8.1 Add expand/collapse toggle to `TaskTableRow` in `task-table-row.tsx`
    - Add `isExpanded` local state
    - Render a chevron icon toggle in a narrow first column
    - Add corresponding empty column header in `task-table.tsx`
    - _Requirements: 7.1_

  - [x] 8.2 Render expandable row with `TaskComments` in `task-table-row.tsx`
    - When `isExpanded` is true, render a second `<TableRow>` below with `colSpan` cell containing `TaskComments`
    - Pass correct `projectId` (empty string for standalone) and `taskId`
    - _Requirements: 7.2, 7.3, 7.4_

  - [x] 8.3 Verify `TaskComments` endpoint switching in `task-comments.tsx`
    - Confirm standalone endpoint (`/tasks/:task_id/comments`) used when `projectId` is empty
    - Confirm project endpoint (`/projects/:project_id/tasks/:task_id/comments`) used when `projectId` is set
    - Fix any issues if endpoint switching is not working correctly
    - _Requirements: 7.5, 10.1, 10.2, 10.3, 10.4_

  - [ ]* 8.4 Write property test for comments endpoint routing (Property 7)
    - **Property 7: Comments endpoint routing by projectId**
    - **Validates: Requirements 7.4, 7.5, 10.1, 10.2, 10.3, 10.4**

- [x] 9. Final checkpoint — All features integrated
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Backend tasks come first so the PATCH endpoint is available when frontend work begins
- The `useUpdateTask` hook generalizes the existing `useUpdateTaskStatus` pattern
- Property tests use `fast-check` and reference design properties by number
- Pessimistic updates are used (wait for API response before confirming changes)
