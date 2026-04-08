# Requirements Document

## Introduction

Rebuild the standalone task system to mirror Pipedrive's Activities feature. The overhaul covers four areas: a modal-based activity form replacing the current full-page form, a configurable-columns table replacing the hardcoded table, inline editing for all editable columns, and backend additions (new columns, relations, and API updates). The existing task page context filters, status/type filters, inline editing patterns, and PATCH hook remain the foundation.

## Glossary

- **Activity_Form_Modal**: A dialog/modal component that replaces the current full-page `internal-task-form.tsx` for creating and editing standalone tasks.
- **Task_Table**: The configurable-columns table component that replaces the current hardcoded `task-table.tsx`.
- **Task_Table_Row**: A single row in the Task_Table supporting inline editing for all editable columns.
- **Column_Config**: A predefined array of all possible table columns, each with an id, label, category, and default visibility flag.
- **Column_Customizer_Modal**: A modal triggered by a ⚙️ icon that lets users toggle column visibility on/off and reset to defaults.
- **Inline_Editor**: A click-to-edit component embedded in a Task_Table_Row cell; type varies by column (text input, calendar popover, dropdown select, search popover, done toggle).
- **Contact**: A record from the existing `contacts` table with fields: name, email, phone, organization.
- **Task_API**: The existing backend endpoints `PATCH /tasks/:task_id` (standalone) and `GET /projects/tasks` (all tasks).
- **ProjectTask_Model**: The Objection.js model backed by the `project_tasks` table.
- **Category_Icon_Row**: A horizontal row of selectable icons representing task category types (Review, Approval, Meeting, Follow-up, Signing, Info Request, Doc Upload).
- **Done_Toggle**: A circular checkbox in the table and form footer that toggles a task between `completed` and its previous non-completed status.
- **Priority**: A new VARCHAR column on `project_tasks` with values: Low, Medium, High, Urgent.
- **Search_Popover**: A popover with a text input that filters a list of records (projects, contacts, or assignees) and allows selection.

## Requirements

### Requirement 1: Activity Form Modal — Layout and Opening

**User Story:** As an internal user, I want to create tasks via a modal dialog instead of navigating to a separate page, so that I stay in context on the task list.

#### Acceptance Criteria

1. WHEN the user clicks the "Add task" button on the task page, THE Activity_Form_Modal SHALL open as a centered overlay dialog without navigating away from the task page.
2. THE Activity_Form_Modal SHALL display a subject line text input at the top of the form, rendered in a large and prominent style.
3. THE Activity_Form_Modal SHALL display a Category_Icon_Row below the subject line with selectable icons for: Review, Approval, Meeting, Follow-up, Signing, Info Request, Doc Upload.
4. WHEN the user clicks a category icon, THE Activity_Form_Modal SHALL visually highlight the selected icon and store the corresponding `task_category_type` value.
5. THE Activity_Form_Modal SHALL display a due date picker field below the category row.
6. THE Activity_Form_Modal SHALL display a notes textarea field labeled "Notes" below the due date picker.
7. THE Activity_Form_Modal SHALL display a searchable "Assigned to" field that lists only internal employees (non-client users) from the company.
8. THE Activity_Form_Modal SHALL display an optional "Link to Project" search field that searches existing projects by name.
9. THE Activity_Form_Modal SHALL display an optional "Link to Contact" search field that searches contacts from the contacts table.
10. WHEN the user selects a contact in the "Link to Contact" field, THE Activity_Form_Modal SHALL auto-populate the subject line with the selected contact's name.
11. THE Activity_Form_Modal SHALL display a "Mark as done" checkbox in the footer area that, when checked, sets the task status to "completed" on save.
12. THE Activity_Form_Modal SHALL display Cancel and Save buttons in the footer.

### Requirement 2: Activity Form Modal — Save Behavior

**User Story:** As an internal user, I want the modal to save tasks correctly for both standalone and project-linked scenarios, so that tasks are persisted with all provided data.

#### Acceptance Criteria

1. WHEN the user clicks Save without a linked project, THE Activity_Form_Modal SHALL call the create-standalone-task endpoint with the form payload including: name, task_category_type, due_date, description (notes), assignees, contact_id, and status.
2. WHEN the user clicks Save with a linked project selected, THE Activity_Form_Modal SHALL call the create-project-task endpoint with the project_id included in the payload.
3. WHEN the "Mark as done" checkbox is checked, THE Activity_Form_Modal SHALL set the status field to "completed" in the payload.
4. WHEN the "Mark as done" checkbox is unchecked, THE Activity_Form_Modal SHALL set the status field to "draft" in the payload.
5. WHEN the save operation succeeds, THE Activity_Form_Modal SHALL close the modal and invalidate the task list query to refresh the table.
6. WHEN the user clicks Cancel, THE Activity_Form_Modal SHALL close the modal without saving any data.
7. IF the save operation fails, THEN THE Activity_Form_Modal SHALL display an error toast and keep the modal open with the form data intact.

### Requirement 3: Configurable Columns — Definition and Defaults

**User Story:** As an internal user, I want the task table to show configurable columns so that I can customize the view to show only the information I need.

#### Acceptance Criteria

1. THE Column_Config SHALL define the following columns with their ids: done, subject, category, due_date, status, priority, project, contact_person, email, phone, organization, assignee, note, created.
2. THE Task_Table SHALL display the following columns as visible by default: done, subject, project, contact_person, due_date, category, status.
3. THE Task_Table SHALL hide the following columns by default: priority, email, phone, organization, assignee, note, created.
4. THE Task_Table SHALL render only the columns that are marked as visible in the current column configuration.

### Requirement 4: Configurable Columns — Customization Modal

**User Story:** As an internal user, I want to toggle columns on and off via a settings modal, so that I can personalize my task table layout.

#### Acceptance Criteria

1. WHEN the user clicks the ⚙️ icon in the table header area, THE Column_Customizer_Modal SHALL open displaying all available columns with toggle switches.
2. WHEN the user toggles a column switch on, THE Column_Customizer_Modal SHALL add that column to the visible set.
3. WHEN the user toggles a column switch off, THE Column_Customizer_Modal SHALL remove that column from the visible set.
4. WHEN the user clicks the "Default" button in the Column_Customizer_Modal, THE Column_Customizer_Modal SHALL reset all column visibility to the predefined defaults.
5. WHEN the Column_Customizer_Modal is closed, THE Task_Table SHALL persist the column preferences to localStorage under a consistent key.
6. WHEN the task page loads, THE Task_Table SHALL read column preferences from localStorage and apply them; if no preferences exist, THE Task_Table SHALL use the default column visibility.

### Requirement 5: Inline Editing — Text Fields

**User Story:** As an internal user, I want to click on a text cell in the table to edit it directly, so that I can update task details without opening a form.

#### Acceptance Criteria

1. WHEN the user clicks on the Subject cell of a Task_Table_Row, THE Inline_Editor SHALL render a text input pre-filled with the current subject value.
2. WHEN the user presses Enter or clicks outside the Subject text input, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with the updated name and revert to read mode.
3. WHEN the user presses Escape while editing the Subject, THE Inline_Editor SHALL discard changes and revert to read mode.
4. WHEN the user clicks on the Note cell of a Task_Table_Row, THE Inline_Editor SHALL render a text input pre-filled with the current description value.
5. WHEN the user presses Enter or clicks outside the Note text input, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with the updated description and revert to read mode.
6. IF the PATCH request fails, THEN THE Inline_Editor SHALL revert the cell to its previous value.

### Requirement 6: Inline Editing — Date Picker

**User Story:** As an internal user, I want to click on the due date cell to open a calendar and pick a new date, so that I can reschedule tasks quickly.

#### Acceptance Criteria

1. WHEN the user clicks on the Due Date cell of a Task_Table_Row, THE Inline_Editor SHALL open a calendar popover anchored to the cell.
2. WHEN the user selects a date from the calendar popover, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with the updated due_date and close the popover.
3. IF the PATCH request fails, THEN THE Inline_Editor SHALL revert the displayed date to its previous value.

### Requirement 7: Inline Editing — Dropdown Selects

**User Story:** As an internal user, I want to click on status, category, or priority cells to select a new value from a dropdown, so that I can update these fields inline.

#### Acceptance Criteria

1. WHEN the user clicks on the Status cell of a Task_Table_Row, THE Inline_Editor SHALL open a dropdown with the available task statuses (Draft, Sent, In Progress, Completed, Archived).
2. WHEN the user selects a status value, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with the updated status.
3. WHEN the user clicks on the Category cell of a Task_Table_Row, THE Inline_Editor SHALL open a dropdown with the available category types (Review, Approval, Meeting, Follow-up, Signing, Info Request, Doc Upload).
4. WHEN the user selects a category value, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with the updated task_category_type.
5. WHEN the user clicks on the Priority cell of a Task_Table_Row, THE Inline_Editor SHALL open a dropdown with the priority values (Low, Medium, High, Urgent).
6. WHEN the user selects a priority value, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with the updated priority.
7. IF any dropdown PATCH request fails, THEN THE Inline_Editor SHALL revert the cell to its previous value.

### Requirement 8: Inline Editing — Search Popovers

**User Story:** As an internal user, I want to click on the project, contact, or assignee cells to search and select a new value, so that I can re-link tasks inline.

#### Acceptance Criteria

1. WHEN the user clicks on the Project cell of a Task_Table_Row, THE Inline_Editor SHALL open a Search_Popover that searches existing projects by name.
2. WHEN the user selects a project from the Search_Popover, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with the updated project_id.
3. WHEN the user clicks on the Contact Person cell of a Task_Table_Row, THE Inline_Editor SHALL open a Search_Popover that searches contacts by name.
4. WHEN the user selects a contact from the Search_Popover, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with the updated contact_id.
5. WHEN the user clicks on the Assignee cell of a Task_Table_Row, THE Inline_Editor SHALL open a Search_Popover that searches internal employees by name.
6. WHEN the user selects an assignee from the Search_Popover, THE Inline_Editor SHALL call the appropriate update endpoint to replace the task assignees.
7. IF any search popover PATCH request fails, THEN THE Inline_Editor SHALL revert the cell to its previous value.

### Requirement 9: Inline Editing — Done Toggle

**User Story:** As an internal user, I want to click a circle icon in the Done column to quickly mark a task as completed or revert it, so that I can manage task completion with one click.

#### Acceptance Criteria

1. THE Task_Table_Row SHALL display a circular toggle icon in the Done column: filled/checked when status is "completed", empty/unchecked otherwise.
2. WHEN the user clicks the Done_Toggle on a non-completed task, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with status set to "completed".
3. WHEN the user clicks the Done_Toggle on a completed task, THE Inline_Editor SHALL call `PATCH /tasks/:task_id` with status set to "draft".
4. IF the PATCH request fails, THEN THE Inline_Editor SHALL revert the Done_Toggle to its previous visual state.

### Requirement 10: Read-Only Columns

**User Story:** As an internal user, I want to see contact-derived fields (email, phone, organization) and the created date in the table without being able to edit them inline, so that I have reference data visible.

#### Acceptance Criteria

1. THE Task_Table_Row SHALL display the Email column as read-only text derived from the linked contact's email field.
2. THE Task_Table_Row SHALL display the Phone column as read-only text derived from the linked contact's phone field.
3. THE Task_Table_Row SHALL display the Organization column as read-only text derived from the linked contact's organization field.
4. THE Task_Table_Row SHALL display the Created column as a read-only formatted timestamp from the task's created_at field.
5. WHEN no contact is linked to a task, THE Task_Table_Row SHALL display "—" in the Email, Phone, and Organization columns.

### Requirement 11: Backend — New Columns and Migration

**User Story:** As a developer, I want new nullable columns on the project_tasks table so that tasks can store contact links and priority values.

#### Acceptance Criteria

1. THE ProjectTask_Model SHALL include a nullable `contact_id` column of type VARCHAR.
2. THE ProjectTask_Model SHALL include a nullable `priority` column of type VARCHAR.
3. THE migration SHALL add the `contact_id` and `priority` columns to the `project_tasks` table only if the columns do not already exist (safe migration with column existence check).
4. THE migration SHALL not drop or modify any existing columns on the `project_tasks` table.

### Requirement 12: Backend — Contact Relation and Data Fetching

**User Story:** As a developer, I want the task API to include contact data in the response so that the frontend can display contact-derived columns without extra API calls.

#### Acceptance Criteria

1. THE ProjectTask_Model SHALL define a `BelongsToOneRelation` named "contact" joining `project_tasks.contact_id` to `contacts.id`.
2. WHEN fetching all tasks via the Task_API, THE ProjectTaskRepository SHALL include the contact relation in the `withGraphFetched` clause, selecting id, name, email, phone, and organization fields.
3. THE Task_API response for each task SHALL include a `contact` object with id, name, email, phone, and organization when a contact_id is set, or null when no contact is linked.

### Requirement 13: Backend — Update Endpoint Extensions

**User Story:** As a developer, I want the standalone task update endpoint to accept contact_id, priority, and description fields so that the frontend can persist all new activity fields.

#### Acceptance Criteria

1. WHEN a PATCH request to `/tasks/:task_id` includes a `contact_id` field, THE Task_API SHALL validate that the contact exists in the same company and update the task's contact_id.
2. WHEN a PATCH request to `/tasks/:task_id` includes a `priority` field, THE Task_API SHALL update the task's priority value.
3. WHEN a PATCH request to `/tasks/:task_id` includes a `description` field, THE Task_API SHALL update the task's description value.
4. WHEN a PATCH request to `/tasks/:task_id` includes a `contact_id` of null, THE Task_API SHALL clear the contact link on the task.
5. IF a provided contact_id does not exist or belongs to a different company, THEN THE Task_API SHALL return a 400 Bad Request response with a descriptive error message.

### Requirement 14: Frontend — Update Hook and Type Extensions

**User Story:** As a developer, I want the frontend update hook and TypeScript types to support the new fields so that inline editing and the form modal can persist all activity data.

#### Acceptance Criteria

1. THE UpdateTaskPayload interface SHALL include optional fields: contact_id (string | null), priority (string), and description (string).
2. THE Task type SHALL include optional fields: contact_id (string | null), contact (object with id, name, email, phone, organization or null), and priority (string).
3. THE useUpdateTask hook SHALL continue to use the existing endpoint pattern (`tasks/:task_id` for standalone, `projects/:project_id/tasks/:task_id` for project-bound) and invalidate both GET_ALL_TASKS and GET_ALL_PROJECT_TASKS query keys on success.
