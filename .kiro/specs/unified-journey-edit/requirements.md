# Requirements Document

## Introduction

The Admin Journey tab currently separates journey name editing and milestone management into two distinct flows: a modal for renaming and inline table editing for milestones. This feature unifies both into a single edit modal that mirrors the existing create journey form UX, allowing users to edit the journey name and all its milestones (add, update, remove) in one place with a single save action.

## Glossary

- **Edit_Journey_Modal**: The unified modal dialog that opens when a user selects "Edit Journey" from the journey row dropdown menu, containing the journey name field and a dynamic list of milestone fields.
- **Journey**: A project type entity (ProjectType) with an id, name, company_id, and is_system flag. One journey has many milestones.
- **Milestone**: A stage within a journey, with id, name, duration, order, project_type_id, company_id, and is_system flag.
- **System_Milestone**: A milestone where is_system equals true, indicating it was created by the platform and cannot be modified or deleted by users.
- **Milestone_List**: The dynamic array of milestone form rows within the Edit_Journey_Modal, supporting add and remove operations.
- **Save_Operation**: The coordinated sequence of API calls executed when the user submits the Edit_Journey_Modal, handling journey name update, milestone creates, updates, and deletes.

## Requirements

### Requirement 1: Display Unified Edit Modal

**User Story:** As an admin, I want to see both the journey name and all its milestones in a single edit modal, so that I can manage the entire journey configuration in one place.

#### Acceptance Criteria

1. WHEN the user selects "Edit Journey" from the journey row dropdown menu, THE Edit_Journey_Modal SHALL open displaying the journey name field pre-populated with the current journey name.
2. WHEN the Edit_Journey_Modal opens, THE Edit_Journey_Modal SHALL fetch and display all existing milestones for the journey as editable rows in the Milestone_List, each showing a name field and a duration field pre-populated with current values.
3. THE Edit_Journey_Modal SHALL display milestones in the same order as returned by the milestones API endpoint.
4. WHEN the user clicks the close button or clicks outside the modal, THE Edit_Journey_Modal SHALL close without saving changes.

### Requirement 2: Edit Journey Name

**User Story:** As an admin, I want to edit the journey name within the unified modal, so that I can rename a journey alongside milestone changes.

#### Acceptance Criteria

1. THE Edit_Journey_Modal SHALL display a "Journey" label with a required indicator above the journey name input field.
2. WHEN the user modifies the journey name field and submits the form, THE Save_Operation SHALL send a PATCH request to update the journey name via the update project type endpoint.
3. IF the journey name field is empty on submission, THEN THE Edit_Journey_Modal SHALL display the validation message "Journey name is required" and prevent submission.

### Requirement 3: Edit Existing Milestones

**User Story:** As an admin, I want to edit milestone names and durations within the unified modal, so that I can update multiple milestones without editing them one at a time.

#### Acceptance Criteria

1. WHEN the user modifies a milestone name or duration field and submits the form, THE Save_Operation SHALL send a PATCH request for each modified milestone via the update milestone endpoint.
2. THE Save_Operation SHALL only send update requests for milestones whose name or duration values have changed from their original values.
3. IF a milestone name field is empty on submission, THEN THE Edit_Journey_Modal SHALL display the validation message "Name is required" next to the corresponding milestone row and prevent submission.
4. IF a milestone duration field is empty or less than 1 on submission, THEN THE Edit_Journey_Modal SHALL display a validation message next to the corresponding milestone row and prevent submission.

### Requirement 4: Add New Milestones

**User Story:** As an admin, I want to add new milestones to an existing journey from the edit modal, so that I can extend a journey without navigating to a separate interface.

#### Acceptance Criteria

1. THE Edit_Journey_Modal SHALL display an "Add stage" button below the Milestone_List.
2. WHEN the user clicks the "Add stage" button, THE Edit_Journey_Modal SHALL append a new empty milestone row with blank name and duration fields to the Milestone_List.
3. WHEN the user submits the form with new milestone rows, THE Save_Operation SHALL send a POST request for each new milestone via the create milestone endpoint, including the project_type_id.
4. THE Edit_Journey_Modal SHALL allow adding multiple new milestones before submitting.

### Requirement 5: Remove Milestones

**User Story:** As an admin, I want to remove milestones from a journey within the edit modal, so that I can streamline a journey without using separate delete confirmations.

#### Acceptance Criteria

1. THE Edit_Journey_Modal SHALL display a remove button on each milestone row that is eligible for removal.
2. WHEN the user clicks the remove button on an existing milestone row, THE Edit_Journey_Modal SHALL visually remove the milestone from the Milestone_List and mark it for deletion on save.
3. WHEN the user submits the form with milestones marked for deletion, THE Save_Operation SHALL send a DELETE request for each removed existing milestone via the delete milestone endpoint.
4. THE Edit_Journey_Modal SHALL require at least one milestone to remain in the Milestone_List at all times, hiding the remove button when only one milestone exists.

### Requirement 6: System Milestone Protection

**User Story:** As an admin, I want system milestones to be protected from modification, so that platform-defined milestones remain consistent.

#### Acceptance Criteria

1. WHILE a milestone has is_system equal to true, THE Edit_Journey_Modal SHALL display the milestone name and duration fields as read-only.
2. WHILE a milestone has is_system equal to true, THE Edit_Journey_Modal SHALL hide the remove button for that milestone row.
3. WHILE a milestone has is_system equal to true, THE Save_Operation SHALL exclude that milestone from update requests regardless of field state.

### Requirement 7: Coordinated Save Operation

**User Story:** As an admin, I want all my changes saved with a single button click, so that I do not have to save the journey name and each milestone separately.

#### Acceptance Criteria

1. THE Edit_Journey_Modal SHALL display a single "Update journey" submit button at the bottom of the form.
2. WHEN the user clicks the "Update journey" button, THE Save_Operation SHALL execute all required API calls: journey name PATCH, milestone PATCHes for modified milestones, POSTs for new milestones, and DELETEs for removed milestones.
3. WHILE the Save_Operation is in progress, THE Edit_Journey_Modal SHALL display a loading state on the submit button and prevent duplicate submissions.
4. WHEN all Save_Operation API calls complete successfully, THE Edit_Journey_Modal SHALL close and the journey list SHALL refresh to reflect the changes.
5. IF any Save_Operation API call fails, THEN THE Edit_Journey_Modal SHALL remain open and display an error indication so the user can retry.

### Requirement 8: Form Validation Schema

**User Story:** As a developer, I want a validation schema for the unified edit form, so that all fields are validated consistently before submission.

#### Acceptance Criteria

1. THE Edit_Journey_Modal SHALL validate the journey name as a required, trimmed string.
2. THE Edit_Journey_Modal SHALL validate each milestone name as a required, trimmed string.
3. THE Edit_Journey_Modal SHALL validate each milestone duration as a required number with a minimum value of 1.
4. WHEN any validation rule fails, THE Edit_Journey_Modal SHALL prevent form submission and display inline error messages next to the failing fields.
