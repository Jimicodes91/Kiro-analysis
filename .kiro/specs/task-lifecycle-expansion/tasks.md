# Implementation Plan: Task Lifecycle Expansion

## Overview

This plan implements the expanded task lifecycle in incremental steps, starting with database schema changes and backend services, then extending the frontend. Each task builds on the previous one. Backend changes are in `Pylott-Backend`, frontend changes are in `Pylott-Web-App`. TypeScript is used throughout.

## Tasks

- [x] 1. Database schema migrations and new models
  - [x] 1.1 Create migration to alter `project_tasks` table — add `signing_status`, `form_config`, and `task_category_type` columns with indexes
    - File: `Pylott-Backend/migrations/YYYYMMDD_alter_project_tasks_lifecycle.ts`
    - Add `signing_status` ENUM nullable, `form_config` JSON nullable, `task_category_type` ENUM nullable
    - Add indexes on `task_category_type` and `status`
    - _Requirements: 13.1, 13.2, 13.3, 13.6_

  - [x] 1.2 Create migration for `task_comments` table
    - File: `Pylott-Backend/migrations/YYYYMMDD_create_task_comments_table.ts`
    - Columns: id, task_id, author_id, content, company_id, created_at, updated_at, deleted_at
    - Foreign key on task_id → project_tasks.id with CASCADE delete
    - Index on task_id
    - _Requirements: 13.4, 13.7_

  - [x] 1.3 Create migration for `task_activity_log` table
    - File: `Pylott-Backend/migrations/YYYYMMDD_create_task_activity_log_table.ts`
    - Columns: id, task_id, action, previous_value, new_value, user_id, metadata (JSON), company_id, created_at
    - Foreign key on task_id → project_tasks.id with CASCADE delete
    - Index on task_id
    - _Requirements: 13.5, 13.7_

  - [x] 1.4 Create `TaskComment` model
    - File: `Pylott-Backend/src/models/task_comment.model.ts`
    - Extend BaseModel, define tableName, fields, and `author` relation to User
    - Register in `Pylott-Backend/src/models/index.ts`
    - _Requirements: 8.1, 8.2_

  - [x] 1.5 Create `TaskActivityLog` model
    - File: `Pylott-Backend/src/models/task_activity_log.model.ts`
    - Extend BaseModel, define tableName, fields, and `user` relation to User
    - Register in `Pylott-Backend/src/models/index.ts`
    - _Requirements: 3.1_

  - [x] 1.6 Extend `ProjectTask` model with new fields and relations
    - File: `Pylott-Backend/src/models/project_task.model.ts`
    - Add `signing_status`, `form_config`, `task_category_type` fields
    - Add `comments` and `activity_log` HasMany relations
    - _Requirements: 13.1, 13.2, 13.3_

- [x] 2. Backend enums and shared constants
  - [x] 2.1 Add new enums to `Pylott-Backend/src/shared/enums/index.ts`
    - Add/update `ProjectTaskStatus` enum with draft, sent, in_progress, completed, archived (keep pending for backward compat)
    - Add `SigningSubStatus`, `TaskCategoryType`, `TaskActivityAction` enums
    - Add `TASK_STATUS_CHANGED`, `TASK_ARCHIVED`, `TASK_SENT` to `AUDIT_TRAIL_ACTION`
    - Add `TASK_STATUS_CHANGED`, `SIGNING_STATUS_CHANGED` to `EmailSubject`
    - _Requirements: 1.1, 1.3, 3.3, 4.3, 10.4_

- [x] 3. StatusTransitionValidator service
  - [x] 3.1 Create `StatusTransitionValidator` service
    - File: `Pylott-Backend/src/modules/projects/services/status-transition.service.ts`
    - Export `TASK_TRANSITION_MAP` and `SIGNING_SUB_STATUS_TRANSITIONS` constants
    - Implement `validateTransition()`, `getValidNextStatuses()`, `validateSigningTransition()`
    - Return error with current/target status on invalid transitions
    - _Requirements: 2.1, 2.2, 2.5_

  - [ ]* 3.2 Write property test for transition map completeness (Property 1)
    - **Property 1: Transition map completeness and correctness**
    - **Validates: Requirements 2.1, 2.2, 2.4**

  - [ ]* 3.3 Write property test for signing sub-status transitions (Property 26)
    - **Property 26: Signing sub-status transition map enforcement**
    - **Validates: Requirements 4.3**

- [x] 4. Extend TaskService with lifecycle logic
  - [x] 4.1 Add `normalizeTaskStatus()` helper and apply to `getTaskById()` and `getAllTask()`
    - File: `Pylott-Backend/src/modules/projects/services/task.service.ts`
    - Map `pending` → `sent` on read
    - _Requirements: 1.4, 14.1, 14.2, 14.5_

  - [x] 4.2 Update `createTask()` to default status to `draft` and validate type-specific fields
    - Call `TaskValidationService` for signing/info-request/doc-upload validation
    - Set `task_category_type` from payload
    - _Requirements: 1.2, 4.2, 5.2, 6.1_

  - [x] 4.3 Update `updateTask()` to call `StatusTransitionValidator` before status changes
    - Log status changes to `task_activity_log`
    - Emit notifications via `NotificationEventEmitter`
    - Enforce admin-only unarchive
    - _Requirements: 2.1, 2.2, 2.5, 3.1, 3.5, 10.1, 10.2, 12.5_

  - [x] 4.4 Implement `updateSigningStatus()` method
    - Validate signing sub-status transitions
    - Store signed document on `signed` status via Cloudinary
    - Log activity, emit notifications
    - _Requirements: 4.3, 4.4, 4.5, 4.7, 10.3, 11.1, 11.2, 11.3_

  - [x] 4.5 Add status and task_category_type filter params to `getAllTask()`
    - Exclude archived by default, support "show archived" filter
    - Support filtering by task_category_type
    - _Requirements: 12.2, 12.3, 15.1, 15.2, 15.6_

  - [ ]* 4.6 Write property tests for task lifecycle (Properties 2, 3, 4, 5, 7, 21, 23, 24)
    - **Property 2: New tasks default to draft status**
    - **Property 3: Backward-compatible status normalization**
    - **Property 4: Activity log entry completeness on status change**
    - **Property 5: Chronological ordering of task timeline data**
    - **Property 7: Signing sub-status independence from main status**
    - **Property 21: Default task list excludes archived tasks**
    - **Property 23: Null category type follows standard lifecycle**
    - **Property 24: is_visible_to_client flag preserved across lifecycle**
    - **Validates: Requirements 1.2, 1.4, 3.1, 3.4, 4.3, 12.2, 14.3, 14.6**

- [ ] 5. Checkpoint — Backend lifecycle core
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. TaskValidationService extensions
  - [x] 6.1 Add `validateSigningTaskFields()`, `validateInfoRequestFields()`, `validateDocUploadConfig()` to TaskValidationService
    - File: `Pylott-Backend/src/modules/projects/services/task-validation.service.ts`
    - Signing: require at least one document attachment
    - Info request: validate mode exclusivity (native or external), URL format for external
    - Doc upload: validate allowed file types and max size config
    - _Requirements: 4.2, 5.2, 5.4, 7.2, 7.3_

  - [ ]* 6.2 Write property tests for task validation (Properties 6, 8, 9, 10, 12, 13)
    - **Property 6: Signing task requires at least one document**
    - **Property 8: Information request mode exclusivity**
    - **Property 9: External form URL validation**
    - **Property 10: Form config round trip**
    - **Property 12: File type validation**
    - **Property 13: File size validation**
    - **Validates: Requirements 4.2, 5.2, 5.4, 5.6, 7.2, 7.3**

- [x] 7. TaskCommentService
  - [x] 7.1 Create `TaskCommentService`
    - File: `Pylott-Backend/src/modules/projects/services/task-comment.service.ts`
    - Implement `createComment()` — store comment, log activity, emit notification
    - Implement `getComments()` — return chronological with author info, pagination
    - Implement `deleteComment()` — soft-delete, validate author or admin role
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_

  - [ ]* 7.2 Write property tests for comments (Properties 14, 15, 16)
    - **Property 14: Comment creation stores all required fields**
    - **Property 15: Comment deletion authorization**
    - **Property 16: External task commenting by both internal and client users**
    - **Validates: Requirements 8.1, 8.2, 8.4, 8.6**

- [x] 8. New API routes and controller methods
  - [x] 8.1 Add task comment routes to `Pylott-Backend/src/modules/projects/projects.route.ts`
    - POST `/projects/:project_id/tasks/:task_id/comments`
    - GET `/projects/:project_id/tasks/:task_id/comments`
    - DELETE `/projects/:project_id/tasks/:task_id/comments/:comment_id`
    - _Requirements: 8.1, 8.3, 8.6_

  - [x] 8.2 Add task activity log route
    - GET `/projects/:project_id/tasks/:task_id/activity`
    - _Requirements: 3.4_

  - [x] 8.3 Add signing status and explicit status transition routes
    - PATCH `/projects/:project_id/tasks/:task_id/signing-status`
    - PATCH `/projects/:project_id/tasks/:task_id/status`
    - _Requirements: 2.1, 4.4, 4.5_

  - [x] 8.4 Add controller methods in `Pylott-Backend/src/modules/projects/projects.controller.ts`
    - Wire all new routes to their respective services
    - _Requirements: 2.1, 3.4, 4.4, 8.1_

- [x] 9. Notification system extensions
  - [x] 9.1 Add new notification event types and handlers
    - Add `task_status_changed`, `task_sent`, `task_archived`, `signing_status_changed` event types
    - Emit from TaskService on status transitions
    - Emit from TaskCommentService on comment creation (exclude comment author)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 9.2 Write property tests for notifications (Properties 17, 18, 19)
    - **Property 17: Status change notifications reach all relevant participants**
    - **Property 18: Signing status change notifies task author**
    - **Property 19: Comment notification excludes comment author**
    - **Validates: Requirements 9.3, 10.1, 10.2, 10.3, 10.5**

- [ ] 10. Checkpoint — Backend complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Frontend types, enums, and shared constants
  - [x] 11.1 Create `Pylott-Web-App/src/types/task.types.ts` with frontend enums and interfaces
    - Add `TaskLifecycleStatus`, `SigningSubStatus`, `TaskCategoryType` enums
    - Add `TaskComment`, `TaskActivityLogEntry`, `FormConfig` interfaces
    - Extend existing Task interface with new fields
    - _Requirements: 1.1, 4.3, 5.6, 8.2_

  - [x] 11.2 Update `Pylott-Web-App/src/lib/constants.ts` — update `taskStatuses` to include all lifecycle statuses
    - _Requirements: 15.5_

  - [x] 11.3 Add shared `TASK_TRANSITION_MAP` constant to frontend
    - File: `Pylott-Web-App/src/lib/task-transitions.ts`
    - Mirror the backend transition map for frontend validation and UI
    - Export `getValidNextStatuses()` helper
    - _Requirements: 2.3, 2.4_

- [x] 12. Task Status Badge component
  - [x] 12.1 Create `TaskStatusBadge` component
    - File: `Pylott-Web-App/src/components/ui/task-status-badge.tsx`
    - Props: `{ status: TaskLifecycleStatus; signingStatus?: SigningSubStatus }`
    - Render colored badge per status: Draft=gray, Sent=blue, In Progress=amber, Completed=green, Archived=slate
    - Show secondary signing sub-status badge when provided
    - _Requirements: 1.5, 4.6, 15.3_

- [x] 13. Type-driven task creation form fields
  - [x] 13.1 Create type-specific field section components
    - `Pylott-Web-App/src/pages/Home/Task/type-fields/signing-task-fields.tsx` — document upload, signer selection, signing instructions
    - `Pylott-Web-App/src/pages/Home/Task/type-fields/info-request-fields.tsx` — mode selector, form/link field, description
    - `Pylott-Web-App/src/pages/Home/Task/type-fields/doc-upload-fields.tsx` — document name, description, accepted types, max size
    - `Pylott-Web-App/src/pages/Home/Task/type-fields/standard-task-fields.tsx` — assignee, description, due date (Review/Approval)
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [x] 13.2 Integrate type-specific fields into `external-task-form.tsx` and `internal-task-form.tsx`
    - Conditionally render the appropriate field section based on selected `task_category_type`
    - Preserve existing form patterns
    - _Requirements: 6.1, 6.6_

  - [ ]* 13.3 Write property test for type-driven field mapping (Property 11)
    - **Property 11: Type-driven form field mapping**
    - **Validates: Requirements 6.1**

- [x] 14. Task Comments panel
  - [x] 14.1 Create `TaskComments` component
    - File: `Pylott-Web-App/src/pages/Home/Task/task-comments.tsx`
    - Display comments in chronological order with author name, timestamp, content
    - Text input for adding new comments
    - Delete button for own comments or admin users
    - _Requirements: 8.1, 8.3, 8.4, 8.6_

  - [x] 14.2 Create TanStack Query hooks for task comments
    - `useTaskComments(taskId)` — GET comments
    - `useCreateTaskComment()` — POST comment mutation
    - `useDeleteTaskComment()` — DELETE comment mutation
    - _Requirements: 8.1, 8.6_

- [x] 15. Task Activity Timeline
  - [x] 15.1 Create `TaskActivityTimeline` component
    - File: `Pylott-Web-App/src/pages/Home/Task/task-activity-timeline.tsx`
    - Vertical timeline showing action, user, and timestamp per entry
    - _Requirements: 3.4_

  - [x] 15.2 Create TanStack Query hook for task activity
    - `useTaskActivity(taskId)` — GET activity log
    - _Requirements: 3.4_

- [x] 16. Task detail view integration
  - [x] 16.1 Integrate `TaskStatusBadge`, `TaskComments`, and `TaskActivityTimeline` into the task detail view
    - Add status transition dropdown showing only valid next statuses from the transition map
    - Wire status transition to PATCH `/status` endpoint
    - Show signing sub-status for signing tasks
    - _Requirements: 1.5, 2.3, 2.4, 3.4, 4.6, 8.3_

- [x] 17. Task list filtering and display updates
  - [x] 17.1 Add status and task type filter controls to task list views
    - Status filter dropdown with all lifecycle statuses
    - Task type filter dropdown
    - "Show archived" toggle (off by default)
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.6_

  - [x] 17.2 Update `task-table-row.tsx` to render `TaskStatusBadge` with distinct colors per status
    - Show signing sub-status alongside main status for signing tasks
    - _Requirements: 1.5, 4.6, 15.3, 15.4_

- [ ] 18. Checkpoint — Frontend complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Backward compatibility and wiring
  - [x] 19.1 Verify existing API contracts are preserved
    - Ensure existing PATCH `/projects/:project_id/tasks/:task_id` still works for general updates
    - Ensure tasks without `task_category_type` follow standard lifecycle
    - Ensure `is_visible_to_client` flag is unaffected by lifecycle changes
    - _Requirements: 14.3, 14.4, 14.6_

  - [x] 19.2 Wire internal task enhancements
    - Ensure internal tasks support full lifecycle
    - Ensure internal task status changes trigger in-app notifications to assigned team members
    - Ensure internal tasks are only visible to assigned members and admin/super_admin
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 20. Final checkpoint — All features integrated
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based test tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Backend tasks (1–10) should be completed before frontend tasks (11–18)
- Checkpoints at tasks 5, 10, 18, and 20 ensure incremental validation
- The transition map constant is shared between backend and frontend (mirrored, not imported across repos)
- All status mapping (`pending` → `sent`) happens at the application layer — no data migration needed
