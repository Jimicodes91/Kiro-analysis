# Implementation Plan: Milestone Reorder

## Overview

Add drag-to-reorder functionality for milestones in the Edit Journey Modal using `@hello-pangea/dnd`. Integrate with the existing `useFieldArray` for local state and `useReorderMilestones` hook for persistence. No backend changes required.

## Tasks

- [x] 1. Extend `computeDiff` to detect reorder changes
  - [x] 1.1 Add `shouldReorder` and `reorderIds` fields to `computeDiff` return value
    - In `edit-jorney-modal.tsx`, extend the `computeDiff` function to accept the current form milestones array
    - Compare persisted milestone IDs (those with `id` and `_isNew !== true`) in their current form-array order against the snapshot order
    - If the order differs, return `shouldReorder: true` and `reorderIds` containing persisted IDs in new order
    - If the order is the same, return `shouldReorder: false` and `reorderIds: []`
    - New unsaved milestones must never appear in `reorderIds`
    - _Requirements: 3.1, 3.2, 6.2, 6.3_

  - [ ]* 1.2 Write property test for `computeDiff` reorder detection (Property 3)
    - **Property 3: computeDiff produces correct reorder payload**
    - Install `fast-check` as a dev dependency
    - Generate random milestone snapshots and random permutations with optional new milestones mixed in
    - Assert `shouldReorder === true` and `reorderIds` contains exactly persisted IDs in new order
    - **Validates: Requirements 3.1, 3.2, 6.3**

  - [ ]* 1.3 Write property test for unchanged order (Property 4)
    - **Property 4: Unchanged order produces no reorder request**
    - Generate random milestone snapshots, create form state with same persisted order (optionally with new milestones interspersed)
    - Assert `shouldReorder === false` and `reorderIds` is empty
    - **Validates: Requirements 6.2**

- [x] 2. Integrate drag-and-drop into the Edit Journey Modal
  - [x] 2.1 Wrap milestone list with `DragDropContext` and `Droppable`
    - In `edit-jorney-modal.tsx`, import `DragDropContext`, `Droppable`, `Draggable` from `@hello-pangea/dnd`
    - Wrap the `fields.map(...)` block with `<DragDropContext onDragEnd={handleDragEnd}>` and `<Droppable droppableId="milestones">`
    - Implement `handleDragEnd` callback: if `destination` is null or `source.index === destination.index`, return early; otherwise call `move(source.index, destination.index)` from `useFieldArray`
    - Destructure `move` from the existing `useFieldArray` call
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 2.2 Wrap each milestone row with `Draggable` and add drag handle
    - Wrap each milestone row `<div>` with `<Draggable draggableId={item.id} index={index}>`
    - Import `GripVertical` from `lucide-react` and render it as the drag handle to the left of the stage name field
    - Set `isDragDisabled={true}` when `is_system === 1` OR `fields.length <= 1`
    - Hide the drag handle icon for system milestones and when only one milestone exists
    - Apply `provided.draggableProps`, `provided.dragHandleProps`, and `provided.innerRef` correctly
    - Style the dragged item with a visual indicator (e.g., shadow/opacity) using `snapshot.isDragging`
    - _Requirements: 1.1, 1.2, 1.3, 2.3, 2.4, 5.1, 5.2, 5.3, 5.4, 6.1_

  - [ ]* 2.3 Write property test for system milestone drag-disabled logic (Property 1)
    - **Property 1: System milestones are non-draggable**
    - Generate random arrays of milestone form items with varying `is_system` values and list lengths
    - Assert that `isDragDisabled` is `true` iff `is_system === 1` OR list length <= 1
    - Assert drag handle is visible iff milestone is draggable
    - **Validates: Requirements 1.1, 1.2, 2.4, 6.1**

  - [ ]* 2.4 Write property test for move operation integrity (Property 2)
    - **Property 2: Move operation preserves list integrity**
    - Generate random milestone arrays and valid `(fromIndex, toIndex)` pairs
    - Apply the move and verify the resulting array has same elements, same length, and moved item at correct position
    - **Validates: Requirements 2.1, 2.2**

- [x] 3. Checkpoint - Verify drag-and-drop works visually
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Wire reorder into form submission
  - [x] 4.1 Call `useReorderMilestones` on submit when order changed
    - In `EditJourneyFormModal`, import and call `useReorderMilestones(projectType.id)`
    - In `onSubmit`, use the extended `computeDiff` result: if `shouldReorder` is true, add the reorder `mutateAsync({ milestone_ids: diff.reorderIds })` call to the `promises` array
    - The reorder call participates in the existing `Promise.allSettled` pattern so errors are handled consistently
    - If no changes at all (including no reorder), close modal without API calls
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.2_

  - [ ]* 4.2 Write unit tests for reorder submission flow
    - Test: reorder 3 milestones [A, B, C] → [C, A, B] and verify `computeDiff` output has correct `reorderIds`
    - Test: submit with no changes produces no reorder API call
    - Test: mix of new and persisted milestones only includes persisted IDs in reorder payload
    - _Requirements: 3.1, 3.2, 6.2, 6.3_

- [x] 5. Ensure milestone table reflects persisted order
  - [x] 5.1 Verify milestone table renders in backend-returned order
    - In `milestone-table.tsx`, confirm milestones render in the order returned by `useGetAllProjectTypeMilestones` (no client-side sort needed since backend returns ordered data)
    - The `useReorderMilestones` hook already invalidates `GET_ALL_PROJECT_TYPE_MILESTONES` cache on success, so the table will re-fetch automatically
    - If the backend does not guarantee order, add `.sort((a, b) => a.order - b.order)` before rendering
    - _Requirements: 4.1, 4.2_

  - [ ]* 5.2 Write property test for milestone table order (Property 5)
    - **Property 5: Milestone table displays in ascending order**
    - Generate random milestone arrays with `order` values
    - Verify the sort-by-order logic produces an ascending sequence
    - **Validates: Requirements 4.1**

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- `@hello-pangea/dnd` provides built-in keyboard accessibility (Space/Enter to pick up, Arrow keys to move, Escape to cancel) satisfying Requirement 5 without custom keyboard code
- The reorder API call is batched with other form changes on submit, not on each drop
- No backend changes are required — the reorder endpoint already exists and is fully functional
- Use `--no-verify` on frontend commits; push to both personal and origin remotes for frontend
