# Implementation Plan: Unified Journey Edit Modal

## Overview

Replace the name-only `EditJourneyFormModal` with a unified modal that manages journey name + milestones (add, update, remove) in a single form. Two files are modified: the validation schema (`admin.ts`) and the modal component (`edit-jorney-modal.tsx`). All backend endpoints already exist — this is frontend-only work using existing hooks and direct `secureRequest` calls for dynamic milestone operations.

## Tasks

- [x] 1. Add the `editJourneyUnifiedSchema` validation schema
  - [x] 1.1 Add `editJourneyUnifiedSchema` to `src/utils/validation-schema/admin.ts`
    - Add a new yup schema named `editJourneyUnifiedSchema` with:
      - `name`: required, trimmed string with message "Journey name is required"
      - `milestones`: array of objects, each with `name` (required, trimmed string, message "Name is required") and `duration` (required number, min 1, message "Must be at least 1"), with `.min(1, "At least one milestone is required")` on the array
    - Follow the same pattern as the existing `addProjectPipelineSchema`
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 1.2 Write property test for validation schema (Property 2)
    - **Property 2: Validation schema rejects invalid form data**
    - Use `fast-check` to generate random form data including empty strings, whitespace-only strings, zero/negative durations, and non-numeric durations
    - Verify the schema rejects all invalid inputs and accepts all valid inputs
    - **Validates: Requirements 2.3, 3.3, 3.4, 8.1, 8.2, 8.3**

- [x] 2. Rewrite `EditJourneyFormModal` with unified form structure
  - [x] 2.1 Set up the modal shell with milestone fetching and form initialization
    - In `src/pages/Home/Admin/journey/edit-jorney-modal.tsx`, rewrite the component to:
      - Import `useGetAllProjectTypeMilestones` and call it with `projectType.id`
      - Import `useFieldArray` from `react-hook-form`
      - Use `editJourneyUnifiedSchema` with `yupResolver`
      - Use `useEffect` to reset form with fetched milestones when data arrives, mapping each milestone to `{ id, name, duration, is_system, _isNew: false }`
      - Store an original milestone snapshot (via `useRef`) for diffing on submit
      - Keep the `Modal` wrapper with title "Edit journey" and the same `onClose`/`isOpen` props
    - Show a loading state while milestones are being fetched
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 Render the journey name field and milestone field array
    - Render the journey name `FormField` with label "Journey" and `isRequired` (same pattern as create modal)
    - Render `useFieldArray` fields as milestone rows, each with:
      - Name input (`FormField` for `milestones.${index}.name`, label "Stage name", `isRequired`)
      - Duration input (`FormField` for `milestones.${index}.duration`, label "Duration (days)", type="number", `isRequired`)
      - Remove button (trash icon) — hidden if `is_system === 1` OR if only one milestone remains in the list
      - System milestones: render name and duration inputs with `disabled` prop when `is_system === 1`
    - Render "Add stage" button below the milestone list (same pattern as create modal with `TooltipProvider`)
    - Render "Update journey" submit button at the bottom
    - _Requirements: 2.1, 4.1, 4.2, 4.4, 5.1, 5.4, 6.1, 6.2, 7.1_

  - [ ]* 2.3 Write unit tests for system milestone protection and remove button visibility
    - Test that system milestone rows render with disabled name and duration fields
    - Test that the remove button is hidden for system milestones
    - Test that the remove button is hidden when only one milestone exists
    - **Validates: Requirements 5.4, 6.1, 6.2**

- [x] 3. Implement the diff-based save operation
  - [x] 3.1 Implement the diff function and coordinated save handler
    - Create a `computeDiff` helper function (can be inline or extracted) that compares form state against the original snapshot and returns:
      - `shouldUpdateName: boolean` — true if `form.name !== projectType.name`
      - `milestonesToCreate: { name, duration, project_type_id }[]` — milestones with `_isNew === true`
      - `milestonesToUpdate: { id, name, duration }[]` — existing non-system milestones whose name or duration changed
      - `milestonesToDelete: string[]` — IDs from the original snapshot not present in the current form array
    - System milestones (`is_system === 1`) must be excluded from updates and deletes
    - Unchanged milestones must produce zero operations
    - _Requirements: 2.2, 3.1, 3.2, 4.3, 5.2, 5.3, 6.3, 7.2_

  - [x] 3.2 Wire the save handler to execute API calls and handle results
    - On form submit, call `computeDiff` then execute all needed API calls:
      - Use `useUpdateProjectTypeDetails(projectType.id)` for journey name PATCH
      - Use `secureRequest` directly (from `@/services/api.service`) for milestone PATCH, POST, and DELETE calls since the existing hooks take IDs as constructor args and can't be used dynamically in a loop
      - Use the endpoint constants from `ENDPOINTS` (`UPDATE_MILESTONE_DETAILS`, `CREATE_MILESTONE`, `DELETE_MILESTONE`)
    - Fire all calls with `Promise.allSettled`
    - On all success: invalidate `GET_ALL_PROJECT_TYPES` and `GET_ALL_PROJECT_TYPE_MILESTONES` queries, close modal
    - On any failure: keep modal open, show error toast
    - Show loading state on submit button during save, prevent duplicate submissions
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

  - [ ]* 3.3 Write property test for diff function (Property 3)
    - **Property 3: Diff function produces correct API operation set**
    - Use `fast-check` to generate random original snapshots and modified form states
    - Verify: name PATCH iff name changed, PATCH for each changed non-system milestone, POST for new milestones, DELETE for removed milestones, zero ops for system milestones and unchanged milestones
    - **Validates: Requirements 2.2, 3.1, 3.2, 4.3, 5.2, 5.3, 6.3, 7.2**

- [x] 4. Checkpoint — Verify all functionality works together
  - Ensure all tests pass, ask the user if questions arise.
  - Verify the modal opens with pre-populated data, milestones can be added/edited/removed, system milestones are protected, and the save operation correctly diffs and calls the right APIs.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The existing `useDeleteMilestone` and `useUpdateMilestone` hooks take IDs as constructor args, so for the coordinated save we use `secureRequest` directly to make dynamic calls in a loop
- The `useCreateMilestone` hook takes no constructor args so it could be used directly, but for consistency the save handler should use `secureRequest` for all milestone operations
- The `editProjectPipelineSchema` (name-only) in `admin.ts` can remain — it's not hurting anything and may be used elsewhere
- Property tests reference design document properties 2 and 3
