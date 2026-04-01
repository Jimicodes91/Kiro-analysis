# Requirements Document

## Introduction

This feature adds drag-to-reorder functionality for milestones within a journey on the admin journey edit page. Admins will be able to reorder milestones by dragging them to a new position, with the updated order persisted to the backend via the existing reorder endpoint. The feature applies to both the edit journey modal (where milestones are managed inline) and the milestone table (where milestones are displayed in a read-oriented list).

## Glossary

- **Admin**: An authenticated user with administrative privileges who manages journeys and milestones
- **Journey**: A project type that contains an ordered sequence of milestones (also referred to as stages)
- **Milestone**: A stage within a journey, stored with an `order` column that determines display sequence
- **Edit_Journey_Modal**: The modal dialog (`edit-jorney-modal.tsx`) used by admins to edit journey details and milestones inline
- **Milestone_Table**: The expandable table (`milestone-table.tsx`) that displays milestones for a journey in the admin journey list
- **Drag_Handle**: A visible UI element on each milestone row that indicates the row is draggable
- **Reorder_API**: The existing backend endpoint `PATCH /projects/types/:project_type_id/milestones/reorder` that accepts a `milestone_ids` array and updates milestone order
- **System_Milestone**: A milestone with `is_system = 1` that cannot be edited or reordered by the admin

## Requirements

### Requirement 1: Drag Handle Visibility

**User Story:** As an admin, I want to see a drag handle on each reorderable milestone, so that I know which milestones can be repositioned.

#### Acceptance Criteria

1. WHEN the Edit_Journey_Modal is open with milestones loaded, THE Edit_Journey_Modal SHALL display a Drag_Handle icon on each milestone row where `is_system` is not equal to 1
2. WHILE a Milestone has `is_system` equal to 1, THE Edit_Journey_Modal SHALL hide the Drag_Handle for that milestone row
3. THE Drag_Handle SHALL be positioned to the left of the milestone name field

### Requirement 2: Drag-to-Reorder Interaction

**User Story:** As an admin, I want to drag milestones to reorder them within a journey, so that I can control the sequence of stages.

#### Acceptance Criteria

1. WHEN the Admin drags a milestone row to a new position within the Edit_Journey_Modal, THE Edit_Journey_Modal SHALL visually update the milestone list to reflect the new order immediately
2. WHEN the Admin drops a milestone row at a new position, THE Edit_Journey_Modal SHALL update the form field array order to match the visual order
3. WHILE a drag operation is in progress, THE Edit_Journey_Modal SHALL display a visual indicator distinguishing the dragged milestone from the rest of the list
4. WHILE a Milestone has `is_system` equal to 1, THE Edit_Journey_Modal SHALL prevent that milestone from being dragged

### Requirement 3: Persist Reorder to Backend

**User Story:** As an admin, I want the new milestone order to be saved when I submit the edit journey form, so that the reorder is persisted.

#### Acceptance Criteria

1. WHEN the Admin submits the Edit_Journey_Modal after reordering milestones, THE Edit_Journey_Modal SHALL send a PATCH request to the Reorder_API with the `milestone_ids` array reflecting the new order
2. THE Reorder_API request SHALL include all existing milestone IDs for the journey in the `milestone_ids` array (new unsaved milestones excluded)
3. WHEN the Reorder_API returns a success response, THE Edit_Journey_Modal SHALL invalidate the milestone query cache so the updated order is reflected in the Milestone_Table
4. IF the Reorder_API returns an error response, THEN THE Edit_Journey_Modal SHALL display an error toast notification to the Admin

### Requirement 4: Milestone Table Read-Only Order

**User Story:** As an admin, I want the milestone table on the journey list page to reflect the persisted order, so that I can verify the reorder was saved.

#### Acceptance Criteria

1. THE Milestone_Table SHALL display milestones in ascending order based on the `order` column returned by the backend
2. WHEN the milestone query cache is invalidated after a successful reorder, THE Milestone_Table SHALL re-fetch and display milestones in the updated order

### Requirement 5: Keyboard Accessibility for Reorder

**User Story:** As an admin using keyboard navigation, I want to reorder milestones without a mouse, so that the feature is accessible.

#### Acceptance Criteria

1. WHEN the Drag_Handle receives keyboard focus and the Admin presses Space or Enter, THE Edit_Journey_Modal SHALL activate drag mode for that milestone
2. WHILE drag mode is active, WHEN the Admin presses ArrowUp or ArrowDown, THE Edit_Journey_Modal SHALL move the milestone one position up or down respectively
3. WHEN the Admin presses Space or Enter during active drag mode, THE Edit_Journey_Modal SHALL drop the milestone at the current position
4. WHEN the Admin presses Escape during active drag mode, THE Edit_Journey_Modal SHALL cancel the drag and restore the original order

### Requirement 6: Edge Case Handling

**User Story:** As an admin, I want the reorder feature to handle edge cases gracefully, so that I don't encounter unexpected behavior.

#### Acceptance Criteria

1. WHEN a journey has only one milestone, THE Edit_Journey_Modal SHALL disable drag-to-reorder functionality for that milestone
2. WHEN the Admin drops a milestone at the same position it started from, THE Edit_Journey_Modal SHALL not send a reorder request to the Reorder_API
3. WHEN the Admin adds a new unsaved milestone and then reorders, THE Edit_Journey_Modal SHALL allow reordering of all visible milestones in the form while only including persisted milestone IDs in the Reorder_API request
