# Requirements Document

## Introduction

This feature completes the Client Documents & Tasks workflow (Parts 2-8) for the PYLOTT platform. It builds on existing infrastructure — the task category system, external task creation form, client task view, document/metadata tables, and document expiry tracking — to deliver a cohesive client-facing experience where a task drives a clear action, and completing that action updates both the task and the client's Documents section.

The work is primarily integration and wiring of existing components, organized into four cohesive areas:

- **Admin Document Configuration (Part 2):** Admins configure whether a document type requires an expiry date, and the client upload experience reflects that configuration.
- **Task Types (Parts 3 & 7):** Extend the admin task creation form so admins can select from a broader set of client task types, each surfacing the correct client action.
- **Document Request Workflow (Parts 4, 5 & 6):** A document-upload task lets a client upload directly from the task; the upload creates a document linked to the task, surfaces it in the client Documents section, and auto-completes the task so the team can confirm the requested document was provided.
- **Task Status Display (Part 8):** The client task list clearly communicates task status, including a computed Overdue state.

The "Complete Form" task type is introduced as an extensible option only. Connecting it to NativeForms is explicitly out of scope for this spec.

## Glossary

- **Admin_Document_Config**: The admin-facing interface and logic for creating and editing document types, including the `requires_expiry` setting.
- **Document_Type**: A row in the `metadata` table describing a category of document. Has `name`, `description`, and `requires_expiry` fields.
- **Task_Type**: The client-facing category of a task, represented by the `task_category_type` field on the `project_tasks` table (values from the `TaskCategoryType` enum: `signing`, `information_request`, `document_upload`, `activity`, `meeting`, `task`, `follow_up`, `message`, `review`).
- **Client_Task_Type**: The subset of Task_Type values exposed to admins when creating a task for a client: `signing`, `information_request` (labeled "Provide Information"), `document_upload`, `task` (labeled "General Task"), and `complete_form` (labeled "Complete Form", extensible placeholder).
- **Document_Upload_Task**: A task with `task_category_type` equal to `document_upload`, which requests that the client upload a document.
- **Client_Action_UI**: The client-facing interface region within the Client_Task_View that changes based on the task's Task_Type to present the appropriate action.
- **Client_Task_View**: The client-facing screen (`src/pages/client/tasks/client-task-view.tsx`) that displays a single task and its action.
- **Client_Task_List**: The client-facing list of tasks (`src/pages/client/tasks/index.tsx` and its task cards).
- **Documents_Section**: The client-facing area where documents linked to the client's project are displayed.
- **Task_Status**: The lifecycle value of a task, one of `draft`, `sent`, `pending`, `in_progress`, `completed`, `archived`.
- **Displayed_Status**: The status label shown to the client, one of `Pending`, `In Progress`, `Completed`, `Overdue`.
- **Overdue**: A computed display state where the current date is past a task's `due_date` and the task's Task_Status is not `completed`.
- **Task_Description**: The `description` field on a task, used to explain what the client needs to provide.
- **Client_Upload_Service**: The backend service handling a client document submission through a Document_Upload_Task.

## Requirements

### Requirement 1: Admin Configures Document Expiry Requirement

**User Story:** As an admin, I want to configure whether a document type requires an expiry date, so that clients are prompted for expiry information only when the document type calls for it.

#### Acceptance Criteria

1. WHEN an admin opens the Admin_Document_Config creation form, THE Admin_Document_Config SHALL display a control for setting whether the Document_Type requires an expiry date.
2. WHEN an admin opens the Admin_Document_Config edit form for an existing Document_Type, THE Admin_Document_Config SHALL display the current value of the `requires_expiry` setting for that Document_Type.
3. WHEN an admin submits the Admin_Document_Config form with the expiry requirement enabled, THE Admin_Document_Config SHALL persist `requires_expiry` as `true` for that Document_Type.
4. WHEN an admin submits the Admin_Document_Config form with the expiry requirement disabled, THE Admin_Document_Config SHALL persist `requires_expiry` as `false` for that Document_Type.
5. WHEN an admin submits the Admin_Document_Config form without changing the expiry control, THE Admin_Document_Config SHALL persist the `requires_expiry` value shown in the form.

### Requirement 2: Client Upload Reflects Document Expiry Configuration

**User Story:** As a client, I want the document upload form to require an expiry date only when the selected document type needs one, so that I provide the correct information without unnecessary fields.

#### Acceptance Criteria

1. WHERE a selected Document_Type has `requires_expiry` equal to `true`, THE document upload form SHALL require an expiry date before submission.
2. WHERE a selected Document_Type has `requires_expiry` equal to `false`, THE document upload form SHALL allow submission without an expiry date.
3. IF a Document_Type has `requires_expiry` equal to `true` AND no expiry date is provided AND the document is not marked as not expiring, THEN THE document upload form SHALL reject the submission and display a validation message.
4. WHEN a document upload form loads for a Document_Type, THE document upload form SHALL determine the expiry requirement from that Document_Type's `requires_expiry` value.

### Requirement 3: Admin Selects Client Task Type

**User Story:** As an admin, I want to choose the type of task I am assigning to a client, so that the client sees the correct action to take.

#### Acceptance Criteria

1. WHEN an admin opens the client task creation form, THE client task creation form SHALL present the Client_Task_Type options: Signing, Provide Information, Document Upload, General Task, and Complete Form.
2. WHEN an admin selects a Client_Task_Type, THE client task creation form SHALL display the configuration fields corresponding to that Client_Task_Type.
3. WHEN an admin submits the client task creation form, THE client task creation form SHALL persist the selected Client_Task_Type as the task's `task_category_type` value.
4. WHERE the selected Client_Task_Type is Complete Form, THE client task creation form SHALL persist the task with a `task_category_type` value reserved for form tasks without requiring a linked external form configuration.
5. IF an admin submits the client task creation form without selecting a Client_Task_Type, THEN THE client task creation form SHALL reject the submission and display a validation message.

### Requirement 4: Client Action UI Matches Task Type

**User Story:** As a client, I want the task screen to show the specific action for the task type, so that I know exactly what to do.

#### Acceptance Criteria

1. WHERE a task's Task_Type is Document Upload, THE Client_Task_View SHALL display a document upload Client_Action_UI.
2. WHERE a task's Task_Type is Signing, THE Client_Task_View SHALL display a signing Client_Action_UI.
3. WHERE a task's Task_Type is Provide Information, THE Client_Task_View SHALL display an information-entry Client_Action_UI.
4. WHERE a task's Task_Type is General Task, THE Client_Task_View SHALL display a general completion Client_Action_UI.
5. WHERE a task's Task_Type is Complete Form, THE Client_Task_View SHALL display a form Client_Action_UI placeholder that does not require an external form connection.
6. WHERE a task has no recognized Task_Type, THE Client_Task_View SHALL display a general completion Client_Action_UI.

### Requirement 5: Client Uploads Document From a Document-Upload Task

**User Story:** As a client, I want to upload the requested document directly from the task, so that I can respond to the request in one place.

#### Acceptance Criteria

1. WHERE a task is a Document_Upload_Task, THE Client_Task_View SHALL provide a file upload control within the Client_Action_UI.
2. WHEN a client submits a file through a Document_Upload_Task, THE Client_Upload_Service SHALL create a document record linked to that task via the document's `task_id`.
3. WHEN a client submits a file through a Document_Upload_Task, THE Client_Upload_Service SHALL set the created document's `is_visible_to_client` value to reflect client visibility.
4. IF a client submits a Document_Upload_Task with no file selected, THEN THE Client_Task_View SHALL reject the submission and display a validation message.

### Requirement 6: Document-Upload Task Completion and Visibility

**User Story:** As a client, I want completing the upload to mark the task done and show my document in the Documents section, so that I have confirmation the request is fulfilled.

#### Acceptance Criteria

1. WHEN a document is created through a Document_Upload_Task, THE Client_Upload_Service SHALL set that task's Task_Status to `completed`.
2. WHEN a document created through a Document_Upload_Task is persisted, THE Documents_Section SHALL include that document in the client's document list.
3. WHEN a document created through a Document_Upload_Task is persisted, THE created document SHALL remain associated with its originating task through the document's `task_id`.
4. WHILE a Document_Upload_Task has Task_Status equal to `completed`, THE Client_Task_View SHALL display the task as completed and SHALL NOT present the upload Client_Action_UI.

### Requirement 7: Team Confirmation of Provided Document

**User Story:** As a team member, I want to see that a requested document was provided, so that I can verify the client fulfilled the request.

#### Acceptance Criteria

1. WHEN a Document_Upload_Task reaches Task_Status `completed` through a client upload, THE team-facing task detail SHALL indicate that the requested document was provided.
2. WHEN a document is linked to a Document_Upload_Task, THE team-facing task detail SHALL associate that document with the task through the document's `task_id`.

### Requirement 8: Document Request Includes a Description

**User Story:** As an admin, I want to include a description on a document-request task, so that the client understands exactly what to upload.

#### Acceptance Criteria

1. WHEN an admin configures a Document_Upload_Task, THE client task creation form SHALL provide a Task_Description field for describing the requested document.
2. WHEN an admin submits a Document_Upload_Task with a Task_Description, THE client task creation form SHALL persist the Task_Description with the task.
3. WHERE a Document_Upload_Task has a non-empty Task_Description, THE Client_Task_View SHALL display the Task_Description to the client.

### Requirement 9: Task Structure Captures Required Attributes

**User Story:** As an admin, I want each client task to capture its name, description, type, due date, and assigned client, so that the task is complete and actionable.

#### Acceptance Criteria

1. WHEN an admin submits the client task creation form, THE client task creation form SHALL persist a task name, a Task_Type, a due date, and at least one assigned client.
2. IF an admin submits the client task creation form without a due date, THEN THE client task creation form SHALL reject the submission and display a validation message.
3. IF an admin submits the client task creation form without at least one assigned client, THEN THE client task creation form SHALL reject the submission and display a validation message.
4. WHEN a client task is persisted, THE persisted task SHALL retain its assigned Task_Type as the required-action indicator for the Client_Task_View.

### Requirement 10: Client Task List Displays Status

**User Story:** As a client, I want the task list to clearly show each task's status, so that I know which tasks need my attention.

#### Acceptance Criteria

1. WHERE a task's Task_Status is `completed`, THE Client_Task_List SHALL display the Displayed_Status "Completed".
2. WHERE a task's Task_Status is `in_progress` AND the task is not Overdue, THE Client_Task_List SHALL display the Displayed_Status "In Progress".
3. WHERE a task's Task_Status is neither `completed` nor `in_progress` AND the task is not Overdue, THE Client_Task_List SHALL display the Displayed_Status "Pending".
4. WHERE a task is Overdue, THE Client_Task_List SHALL display the Displayed_Status "Overdue".

### Requirement 11: Overdue Status Computation

**User Story:** As a client, I want overdue tasks to be flagged, so that I can prioritize tasks past their due date.

#### Acceptance Criteria

1. WHERE the current date is past a task's `due_date` AND the task's Task_Status is not `completed`, THE Client_Task_List SHALL classify the task as Overdue.
2. WHERE a task's Task_Status is `completed`, THE Client_Task_List SHALL NOT classify the task as Overdue regardless of its `due_date`.
3. WHERE a task has no `due_date`, THE Client_Task_List SHALL NOT classify the task as Overdue.
4. WHERE the current date is on or before a task's `due_date`, THE Client_Task_List SHALL NOT classify the task as Overdue.
