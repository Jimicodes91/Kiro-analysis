# Implementation Plan: Activity Table (Pipedrive-Style)

## Overview

Transform the standalone task system into a Pipedrive-style Activities feature across backend (migration, model, service) and frontend (modal form, configurable table, inline editing). Tasks are ordered so backend changes land first, then frontend types/hooks, then UI components, wiring everything incrementally.

## Tasks

- [x] 1. Backend — Migration, model, and service updates
  - [x] 1.1 Create migration to add `contact_id` and `priority` columns to `project_tasks`
    - Create `Pylott-Backend/migrations/20260408000000_add_contact_id_priority_to_project_tasks.ts`
    - Add nullable `contact_id` VARCHAR(255) and nullable `priority` VARCHAR(50) columns
    - Use `hasColumn` checks before each `ALTER TABLE` to make migration idempotent (staging DB may already have columns)
    - Migration down should drop columns only if they exist
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 1.2 Add `contact_id`, `priority` properties and `contact` relation to ProjectTask model
    - In `Pylott-Backend/src/models/project_task.model.ts`, add `contact_id?: string` and `priority?: string` properties
    - Add a `contact` BelongsToOneRelation mapping `project_tasks.contact_id` → `contacts.id` with a filter selecting `id, name, email, phone, organization`
    - Import the Contact model via `require('./contact.model').Contact`
    - _Requirements: 11.1, 11.2, 12.1_

  - [x] 1.3 Include `contact` in `withGraphFetched` for `getAllTasks` and `getTaskDetails`
    - In `Pylott-Backend/src/repositories/project_task.repository.ts`, add `contact: true` to the `withGraphFetched` object in `getAllTasks` and `getTaskDetails` methods
    - The relation filter already selects id, name, email, phone, organization
    - _Requirements: 12.2, 12.3_

  - [x] 1.4 Extend `updateStandaloneTask` to accept `contact_id`, `priority`, and `description`
    - In `Pylott-Backend/src/modules/projects/services/task.service.ts`, extend the `updateStandaloneTask` payload type to include `contact_id?: string | null`, `priority?: string`, `description?: string`
    - When `contact_id` is provided and not null, validate the contact exists in the same company; return 400 if invalid
    - When `contact_id` is explicitly null, clear the contact link
    - Pass `priority` and `description` through to the repository update
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ]* 1.5 Write property test for contact validation on PATCH
    - **Property 17: Contact validation on PATCH**
    - **Validates: Requirements 13.1, 13.5**

  - [ ]* 1.6 Write property test for migration idempotency
    - **Property 15: Migration is idempotent**
    - **Validates: Requirements 11.3**

- [x] 2. Checkpoint — Backend changes complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Frontend — Type extensions and hook updates
  - [x] 3.1 Extend Task types and UpdateTaskPayload
    - In `Pylott-Web-App/src/types/task.types.ts`, add a `Contact` interface with `id, name, email, phone, organization` fields
    - Add `contact_id?: string | null`, `contact?: Contact | null`, and `priority?: string` to the `Task` interface
    - In `Pylott-Web-App/src/hooks/project-modules/tasks/use-update-task.tsx`, extend `UpdateTaskPayload` to include `contact_id?: string | null`, `priority?: string`, `description?: string`
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ]* 3.2 Write property test for mark-as-done status mapping
    - **Property 3: Mark-as-done maps to correct status**
    - **Validates: Requirements 2.3, 2.4**

  - [ ]* 3.3 Write property test for done toggle behavior
    - **Property 12: Done toggle flips between completed and draft**
    - **Validates: Requirements 9.2, 9.3**

- [x] 4. Frontend — Column configuration and configurable table
  - [x] 4.1 Create column config constants and localStorage helpers
    - Create `Pylott-Web-App/src/pages/Home/Task/column-config.ts`
    - Define `ALL_COLUMNS` array with all 14 columns (done, subject, project, contact_person, due_date, category, status, priority, email, phone, organization, assignee, note, created) with `id`, `label`, `defaultVisible`, `editable` properties
    - Create `getVisibleColumns()` and `setVisibleColumns()` helpers using localStorage key `pylott_task_column_prefs`
    - Handle corrupted/invalid JSON by falling back to defaults
    - _Requirements: 3.1, 3.2, 3.3, 4.5, 4.6_

  - [ ]* 4.2 Write property test for column preferences localStorage round trip
    - **Property 6: Column preferences localStorage round trip**
    - **Validates: Requirements 4.5, 4.6**

  - [x] 4.3 Create ColumnCustomizerModal component
    - Create `Pylott-Web-App/src/pages/Home/Task/column-customizer-modal.tsx`
    - Use the existing Modal component (framer-motion portal)
    - Display all 14 columns with toggle switches
    - Include a "Default" button that resets to predefined defaults
    - Call `onColumnsChange` callback when toggles change
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 4.4 Write property test for column toggle updates visible set
    - **Property 5: Column toggle updates visible set correctly**
    - **Validates: Requirements 4.2, 4.3**

  - [x] 4.5 Rebuild TaskTable with configurable columns
    - Replace `Pylott-Web-App/src/pages/Home/Task/task-table.tsx` with a configurable-columns version
    - Read visible columns from localStorage on mount (via helpers from 4.1)
    - Render only visible column headers dynamically from `ALL_COLUMNS`
    - Add ⚙️ icon button in the header area that opens ColumnCustomizerModal
    - Persist column changes to localStorage when ColumnCustomizerModal closes
    - Keep existing filtering logic (search, status, type, archived, context)
    - _Requirements: 3.4, 4.1, 4.5, 4.6_

  - [ ]* 4.6 Write property test for table rendering visible columns
    - **Property 4: Table renders exactly the visible columns**
    - **Validates: Requirements 3.4**

- [x] 5. Checkpoint — Configurable table renders with column customization
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Frontend — InlineEditor component and TaskTableRow rebuild
  - [x] 6.1 Create InlineEditor component with all variants
    - Create `Pylott-Web-App/src/pages/Home/Task/inline-editor.tsx`
    - Implement `text` variant: click → input, Enter/blur → PATCH via `useUpdateTask`, Escape → discard
    - Implement `date` variant: click → Calendar popover, select → PATCH
    - Implement `select` variant: click → dropdown (for status, category, priority), select → PATCH
    - Implement `search` variant: click → SearchPopover (for project, contact, assignee), select → PATCH
    - Implement `toggle` variant: click → immediate PATCH (done toggle, completed ↔ draft)
    - All variants: on PATCH failure, revert to previous value
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 7.1–7.7, 8.1–8.7, 9.1–9.4_

  - [x] 6.2 Create SearchPopover reusable component
    - Create `Pylott-Web-App/src/pages/Home/Task/search-popover.tsx`
    - Popover with text input that filters a list of items
    - Accept `items`, `onSelect`, `placeholder`, `isLoading` props
    - Show "No results found" when search returns empty
    - Used by InlineEditor (search variant) and ActivityFormModal
    - _Requirements: 8.1, 8.3, 8.5_

  - [x] 6.3 Rebuild TaskTableRow with InlineEditor for all editable columns
    - Replace `Pylott-Web-App/src/pages/Home/Task/task-table-row.tsx`
    - Render cells dynamically based on visible columns passed from TaskTable
    - Editable cells (done, subject, project, contact_person, due_date, category, status, priority, assignee, note) use InlineEditor with appropriate variant
    - Read-only cells (email, phone, organization, created) render plain text from `task.contact?.email`, etc.
    - Display "—" for email, phone, organization when no contact is linked
    - Display formatted timestamp for created column
    - _Requirements: 5.1–5.6, 6.1–6.3, 7.1–7.7, 8.1–8.7, 9.1–9.4, 10.1–10.5_

  - [ ]* 6.4 Write property test for contact-derived fields display
    - **Property 13: Contact-derived fields display correctly**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.5**

  - [ ]* 6.5 Write property test for PATCH failure revert behavior
    - **Property 9: PATCH failure reverts cell to previous value**
    - **Validates: Requirements 5.6, 6.3, 7.7, 8.7, 9.4**

  - [ ]* 6.6 Write property test for Escape discards inline edit changes
    - **Property 8: Escape discards inline edit changes**
    - **Validates: Requirements 5.3**

- [x] 7. Checkpoint — Inline editing works for all column types
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Frontend — ActivityFormModal
  - [x] 8.1 Create ActivityFormModal component
    - Create `Pylott-Web-App/src/pages/Home/Task/activity-form-modal.tsx`
    - Use existing Modal component (framer-motion portal)
    - Layout top to bottom: subject line (large text input), Category_Icon_Row (7 selectable icons), due date picker, notes textarea, assigned-to SearchPopover (internal employees only), link-to-project SearchPopover, link-to-contact SearchPopover
    - When a contact is selected, auto-populate the subject line with the contact's name
    - Footer: "Mark as done" checkbox, Cancel button, Save button
    - _Requirements: 1.1–1.12_

  - [x] 8.2 Implement ActivityFormModal save logic
    - No project selected → call create-standalone-task endpoint
    - Project selected → call create-project-task endpoint with project_id
    - Mark as done checked → `status: "completed"`, unchecked → `status: "draft"`
    - Include `contact_id` and `priority` in payload
    - On success: close modal, invalidate `GET_ALL_TASKS` query
    - On failure: show error toast, keep modal open with form data intact
    - _Requirements: 2.1–2.7_

  - [ ]* 8.3 Write property test for save endpoint routing
    - **Property 2: Save endpoint routing by project linkage**
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 8.4 Write property test for assignee search filtering
    - **Property 1: Assignee search filters out clients**
    - **Validates: Requirements 1.7**

- [x] 9. Frontend — Wire task page to use modal instead of navigation
  - [x] 9.1 Update task page index.tsx to open ActivityFormModal
    - In `Pylott-Web-App/src/pages/Home/Task/index.tsx`, replace `navigate("/task/new/internal")` with opening the ActivityFormModal
    - Add modal state (`isOpen`) and render `<ActivityFormModal>` in the component
    - Remove the `useNavigate` import if no longer needed
    - _Requirements: 1.1_

- [x] 10. Final checkpoint — Full feature integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Backend changes (task 1) must be deployed before frontend changes that depend on new fields
- The existing `useUpdateTask` hook, `useGetAllTasks` hook, and Modal component are reused throughout
- Column preferences are stored in localStorage (key: `pylott_task_column_prefs`), not on the server
- Property tests use fast-check with minimum 100 iterations per property
