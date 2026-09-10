# Implementation Plan: Client Documents & Tasks (Parts 2–8)

## Overview

This plan completes the Client Documents & Tasks workflow by wiring together existing pieces of the PYLOTT platform. The frontend codebase is **React-only** (React 19, TypeScript, Vite, TailwindCSS, React Query) at this workspace root.

**Backend tasks live in the sibling repository `/Users/jimi/pylott-backend/`** and are called out explicitly. They include a database migration (adding `requires_expiry` to the `metadata` table), enum extension, and upload-service auto-completion logic. Each backend migration must be run separately in that repo (its own migration runner) and is not executed from this workspace.

The work is organized into the four cohesive areas from the design:

- **Area 1 — Admin Document Config (Part 2):** persist and surface a `requires_expiry` flag on document types; enforce it on client upload.
- **Area 2 — Task Types (Parts 3 & 7):** extend the client task type set (add `complete_form`, "General Task", "Provide Information") in both frontend and backend enums and the admin task form.
- **Area 3 — Doc-Task Workflow (Parts 4, 5, 6):** upload a document from a task, link it via `task_id`, auto-complete the task, and surface it in the client Documents section.
- **Area 4 — Overdue Status (Part 8):** a pure frontend utility computes the displayed status (including `Overdue`) for client task cards and the task list.

## Tasks

- [x] 1. Area 1 — Admin Document Config (Part 2)
  - [x] 1.1 Backend: add `requires_expiry` column to the `metadata` table _(sibling repo `/Users/jimi/pylott-backend/`)_
    - Create a migration adding `requires_expiry BOOLEAN NOT NULL DEFAULT false` to the `metadata` table
    - Run the migration separately using the backend repo's migration runner
    - _Requirements: 1.3, 1.4_

  - [x] 1.2 Backend: persist `requires_expiry` in document-type create/update service _(sibling repo `/Users/jimi/pylott-backend/`)_
    - Update the Metadata/DocumentType service `create` and `update` methods to accept and persist `requires_expiry` on the `metadata` record
    - Keep the existing `ServiceType` return shape; controller continues to respond via `genericResponse`
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 1.3 Frontend: add `requires_expiry` to the `DocumentTypeDetails` type
    - Add `requires_expiry: boolean` to `DocumentTypeDetails` in `src/types/api.types.ts`
    - _Requirements: 1.2_

  - [x] 1.4 Frontend: add expiry schema field and update document-type hooks
    - Extend `addDocumentTypeSchema` in `src/utils/validation-schema/admin.ts` with `requires_expiry: yup.boolean().default(false)`
    - Add `requires_expiry?: boolean` to the mutation payload types in `use-create-document-type.tsx` and `use-update-document-type.tsx`
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 1.5 Frontend: add "Requires expiry date?" toggle to the add/edit document type modal
    - In `src/pages/Home/Admin/Document/add-document-type-model.tsx`, seed form default `requires_expiry` from `documentType?.requires_expiry ?? false` (Req 1.2)
    - Add a `FormField` rendering the existing `Switch` component for `requires_expiry` (Req 1.1)
    - Pass `requires_expiry` through the create and update submit payloads (Req 1.3, 1.4, 1.5)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.6 Frontend: add `isExpiryRequired` utility and enforce it on client upload
    - Create a pure helper `isExpiryRequired(documentType, doesNotExpire): boolean` returning `true` iff `documentType.requires_expiry === true` AND `doesNotExpire !== true`
    - In the client document upload path (consistent with `upload-document-modal.tsx`), reject submission with a validation message when `isExpiryRequired` is true and no `expiry_date` is present; allow submission with no expiry otherwise
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x]* 1.7 Write property test for expiry-required decision
    - **Property 3: Expiry-required decision**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
    - Use `fast-check` + `vitest`, minimum 100 iterations
    - Generate arbitrary `requires_expiry` and `doesNotExpire` booleans; assert `isExpiryRequired` is true iff `requires_expiry === true` AND `doesNotExpire !== true`
    - Tag: `// Feature: client-documents-tasks, Property 3`

  - [x]* 1.8 Write property test for requires_expiry propagation
    - **Property 6: Document-type expiry-config propagation**
    - **Validates: Requirements 1.3, 1.4, 1.5**
    - Generate arbitrary boolean toggle values; assert the submitted mutation payload's `requires_expiry` equals the toggle value
    - Tag: `// Feature: client-documents-tasks, Property 6`

  - [x]* 1.9 Write example tests for the document-type modal
    - Render the add/edit modal; assert the expiry toggle is present (Req 1.1) and reflects the seeded value on edit (Req 1.2)
    - _Requirements: 1.1, 1.2_

- [x] 2. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Area 2 — Task Types (Parts 3 & 7)
  - [x] 3.1 Frontend: add `COMPLETE_FORM` to the frontend `TaskCategoryType` enum
    - Add `COMPLETE_FORM = "complete_form"` to `TaskCategoryType` in `src/types/task.types.ts`
    - _Requirements: 3.4_

  - [x] 3.2 Backend: add `COMPLETE_FORM` to the backend `TaskCategoryType` enum _(sibling repo `/Users/jimi/pylott-backend/`)_
    - Add `COMPLETE_FORM = "complete_form"` to `TaskCategoryType` in `src/shared/enums/index.ts`
    - No migration required — `task_category_type` is a string column that must accept the new value
    - _Requirements: 3.3, 3.4_

  - [x] 3.3 Frontend: extend client task type options in the external task form
    - In `src/pages/Home/Task/external-task-form.tsx`, extend `EXTERNAL_CATEGORY_TYPES` to the five client task types: `signing` → "Signing", `information_request` → "Provide Information", `document_upload` → "Document Upload", `task` → "General Task", `complete_form` → "Complete Form"
    - Ensure the selected value persists directly as `task_category_type`, and `complete_form` persists with no linked form configuration (`form_config` stays optional)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.4 Frontend: add a `description` field to the external task form and schema
    - Add a `description` field to the external task form and its validation schema, mapping to the task `description`
    - _Requirements: 8.1, 8.2_

  - [x]* 3.5 Write property test for task-creation payload mapping
    - **Property 5: Task-creation payload mapping**
    - **Validates: Requirements 3.3, 3.4, 8.2, 9.1, 9.4**
    - Generate valid form inputs (name, allowed `task_category_type`, due date, ≥1 client id, optional description); assert the create payload carries `task_category_type` unchanged, the due date, assigned clients, and description — and requires no form config when type is `complete_form`
    - Tag: `// Feature: client-documents-tasks, Property 5`

  - [x]* 3.6 Write example tests for the external task form option list
    - Assert all five client task type options are present (Req 3.1) and selecting each shows the corresponding fields (Req 3.2)
    - Assert Yup rejects submission with no type (Req 3.5), no due date (Req 9.2), and no assigned client (Req 9.3)
    - _Requirements: 3.1, 3.2, 3.5, 9.2, 9.3_

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Area 3 — Doc-Task Workflow (Parts 4, 5, 6)
  - [x] 5.1 Frontend: extend action UI resolution in the client task view
    - In `src/pages/client/tasks/client-task-view.tsx`, extend `CATEGORY_TYPE_LABELS` and the action area to cover `task` (general completion UI) and `complete_form` (form placeholder UI requiring no external connection)
    - Keep `document_upload`, `signing`, `information_request` action UIs; unrecognized types fall back to the general completion UI
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 5.2 Frontend: submit client document upload from the task
    - In the `document_upload` action path of `client-task-view.tsx`, validate at least one file is selected before submitting (show a validation message otherwise) (Req 5.4)
    - Submit through the upload path with `task_id`, `is_visible_to_client: true`, and expiry fields (`expiry_date`, `does_not_expire`) when applicable (Req 5.1, 5.2, 5.3)
    - On success, invalidate the task and documents queries and render the completed state, hiding the upload UI (Req 6.4)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.4_

  - [x] 5.3 Frontend: render the task description in the instructions card
    - Ensure a non-empty `task.description` renders in the instructions card for `document_upload` tasks
    - _Requirements: 8.3_

  - [x] 5.4 Backend: auto-complete the task on document upload _(sibling repo `/Users/jimi/pylott-backend/`)_
    - In the Document/Upload service, when a document is created referencing a `task_id`: create the `documents` record with `task_id`, `project_id`, optional `document_type_id`, and `is_visible_to_client` for client visibility (Req 5.2, 5.3)
    - In the same atomic operation, set that task's `status` to `completed`; if the completion update fails, do not report the create as successful (Req 6.1, 7.1)
    - Keep the document associated with the task via `task_id` (Req 6.3, 7.2)
    - _Requirements: 5.2, 5.3, 6.1, 6.3, 7.1, 7.2_

  - [x]* 5.5 Write property test for action-UI resolution totality
    - **Property 4: Action-UI resolution totality**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 6.4**
    - Generate arbitrary `task_category_type` strings (allowed set plus unknown) and arbitrary statuses; assert the resolver returns a defined UI kind, unknown types map to general completion, and `completed` status resolves to the completed state with no upload affordance
    - Tag: `// Feature: client-documents-tasks, Property 4`

  - [x]* 5.6 Write property tests for backend upload logic _(sibling repo `/Users/jimi/pylott-backend/`)_
    - **Property 7: Auto-completion on upload** — for any `document_upload` task, creating a document referencing its `task_id` results in status `completed` (**Validates: Requirements 6.1, 7.1**)
    - **Property 8: Document creation and linkage on upload** — for any submission referencing a `task_id`, the created document retains that `task_id`, is associated with the task's project, and carries an `is_visible_to_client` value (**Validates: Requirements 5.2, 5.3, 6.3, 7.2**)
    - Implement in the backend repo's test suite (service code is not present in this workspace)

  - [x]* 5.7 Write integration test for document surfacing and team confirmation
    - After an upload-through-task, assert the document appears in the client documents list (Req 6.2) and the team task detail shows the linked document (Req 7.1)
    - _Requirements: 6.2, 7.1_

- [x] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Area 4 — Overdue Status (Part 8)
  - [x] 7.1 Frontend: create the task display status utility
    - Create `src/utils/task-display-status.ts` exporting `DisplayedStatus`, `isOverdue(status, dueDate?, now?)`, `getDisplayedStatus(status, dueDate?, now?)`, and `getDisplayedStatusBadgeVariant(status)`
    - `isOverdue` is true only when `dueDate` exists, `now` is strictly past `dueDate`, and `status !== "completed"`
    - `getDisplayedStatus`: `completed` → "Completed"; else overdue → "Overdue"; else `in_progress` → "In Progress"; else "Pending"
    - Map badge variants to existing `Badge` variants (overdue → red/destructive)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 11.4_

  - [x] 7.2 Frontend: use `getDisplayedStatus` in the client task card and list
    - Update `client-test-card.tsx` and `src/pages/client/tasks/index.tsx` to replace the raw `task.status` badge with `getDisplayedStatus(...)` output and `getDisplayedStatusBadgeVariant(...)`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x]* 7.3 Write property test for overdue computation
    - **Property 1: Overdue computation**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
    - Generate arbitrary statuses and due dates spanning past/today/future plus `undefined`/`null`; assert `isOverdue` is true iff a due date exists, `now` is strictly past it, and status is not `completed`
    - Tag: `// Feature: client-documents-tasks, Property 1`

  - [x]* 7.4 Write property test for displayed status mapping
    - **Property 2: Displayed status mapping**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
    - Generate arbitrary statuses and due dates; assert `getDisplayedStatus` returns "Completed" for completed, else "Overdue" when overdue, else "In Progress" for in_progress, else "Pending"
    - Tag: `// Feature: client-documents-tasks, Property 2`

- [x] 8. Final Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- **Backend coordination required** — the following are in the sibling repo `/Users/jimi/pylott-backend/` and are not implemented from this workspace:
  - Migration adding `requires_expiry BOOLEAN NOT NULL DEFAULT false` to `metadata` (task 1.1) — must be run separately with the backend migration runner
  - Document-type service persistence of `requires_expiry` (task 1.2)
  - `COMPLETE_FORM` added to the backend `TaskCategoryType` enum (task 3.2) — no migration needed (string column)
  - Upload-service auto-completion and document linkage (task 5.4) and its property tests (task 5.6)
- Tasks marked with `*` are optional and can be skipped for faster MVP.
- Each task references specific requirements for traceability.
- Checkpoints ensure incremental validation between the four areas.
- Frontend-testable properties (1, 2, 3, 4, 5, 6) use `fast-check` + `vitest` at minimum 100 iterations, tagged `// Feature: client-documents-tasks, Property {n}`. `fast-check` must be installed as a dev dependency.
- Backend properties (7, 8) are documented for traceability and expected to be property-tested in the backend repo.
- `Overdue` is a computed, display-only state — no database column and no backend assertion.
- The `complete_form` type is an extensible placeholder only; connecting it to NativeForms is out of scope for this spec.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3", "3.1", "3.2", "7.1"] },
    { "id": 1, "tasks": ["1.2", "1.4", "3.3", "3.4", "7.2", "7.3", "7.4"] },
    { "id": 2, "tasks": ["1.5", "1.6", "3.5", "3.6", "5.1"] },
    { "id": 3, "tasks": ["1.7", "1.8", "1.9", "5.2", "5.3", "5.4"] },
    { "id": 4, "tasks": ["5.5", "5.6", "5.7"] }
  ]
}
```
