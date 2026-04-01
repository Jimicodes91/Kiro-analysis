# Requirements Document

## Introduction

This feature replaces the single-client input fields in the project creation form with a dynamic multi-client list. Users can add multiple clients (each with name, email, and phone) during project creation. Each client gets an independent contact record, all clients are linked to the project via the `project_client` array, and the invite flow applies to all listed clients when enabled.

## Glossary

- **Project_Creation_Form**: The simplified project creation form rendered by `simplified-project-form.tsx` that collects project details and client information.
- **Client_Entry**: A single row in the dynamic client list containing name, email, and phone fields for one client.
- **Client_List**: The dynamic collection of Client_Entry items displayed in the Project_Creation_Form, replacing the previous single-client fields.
- **Backend_Project_Service**: The server-side service (`projects.service.ts`) responsible for creating projects, creating/linking contacts, and sending invitations.
- **Contact_Record**: A row in the `contacts` table representing an individual client with email, name, phone, and other metadata.
- **Project_Client_Array**: The `project_client` field in the project's `form_data` JSON, containing an array of contact IDs linked to the project.
- **Invite_Checkbox**: The `send_client_invite` boolean toggle in the Project_Creation_Form that controls whether platform invitations are sent to clients.

## Requirements

### Requirement 1: Dynamic Client List UI

**User Story:** As a user, I want to add multiple clients when creating a project, so that I can associate all relevant clients with a project in one step.

#### Acceptance Criteria

1. WHEN the Project_Creation_Form loads, THE Client_List SHALL display one Client_Entry with name, email, and phone fields.
2. WHEN the user clicks the "Add another client" button, THE Client_List SHALL append a new empty Client_Entry to the list.
3. THE Project_Creation_Form SHALL display a remove button on each Client_Entry except the first Client_Entry in the Client_List.
4. WHEN the user clicks the remove button on a Client_Entry, THE Client_List SHALL remove that Client_Entry from the list.
5. THE Client_List SHALL allow a minimum of one Client_Entry and impose no fixed upper limit on the number of Client_Entry items.

### Requirement 2: Client Entry Validation

**User Story:** As a user, I want the form to validate each client's information, so that I only submit correct and complete client data.

#### Acceptance Criteria

1. THE Project_Creation_Form SHALL require a valid email address for each Client_Entry in the Client_List.
2. THE Project_Creation_Form SHALL require a phone number for each Client_Entry in the Client_List.
3. THE Project_Creation_Form SHALL treat the client name field as optional for each Client_Entry.
4. WHEN the user submits the form with any Client_Entry containing an invalid or missing required field, THE Project_Creation_Form SHALL display a validation error on the specific Client_Entry field that failed validation.

### Requirement 3: Duplicate Email Prevention

**User Story:** As a user, I want the form to prevent me from entering the same email twice, so that I do not accidentally create duplicate client associations on a project.

#### Acceptance Criteria

1. WHEN the user enters an email address in a Client_Entry that matches the email address of another Client_Entry in the same Client_List, THE Project_Creation_Form SHALL display a validation error indicating the email is a duplicate.
2. THE Project_Creation_Form SHALL perform duplicate email comparison in a case-insensitive manner.
3. THE Project_Creation_Form SHALL prevent form submission while any duplicate email validation error exists.

### Requirement 4: Backend Multi-Client Contact Creation

**User Story:** As a user, I want each client I add to be saved as an independent contact, so that client records are properly maintained in the system.

#### Acceptance Criteria

1. WHEN the Project_Creation_Form submits multiple Client_Entry items, THE Backend_Project_Service SHALL create or link a Contact_Record for each Client_Entry.
2. WHEN a Client_Entry email matches an existing Contact_Record in the same company, THE Backend_Project_Service SHALL link the existing Contact_Record to the project instead of creating a duplicate.
3. WHEN a Client_Entry email does not match any existing Contact_Record, THE Backend_Project_Service SHALL create a new Contact_Record with the provided name, email, and phone.
4. THE Backend_Project_Service SHALL add the contact ID of each processed Client_Entry to the Project_Client_Array in the project's form_data.

### Requirement 5: Backend Duplicate Email Rejection

**User Story:** As a developer, I want the backend to reject duplicate client emails in a single request, so that data integrity is enforced regardless of the client.

#### Acceptance Criteria

1. WHEN the Backend_Project_Service receives a project creation request containing multiple Client_Entry items with the same email address (case-insensitive), THE Backend_Project_Service SHALL return a validation error with HTTP status 400.
2. THE Backend_Project_Service SHALL include a descriptive error message identifying the duplicated email address.

### Requirement 6: Multi-Client Invite Flow

**User Story:** As a user, I want all clients to receive invitations when I enable the invite option, so that every client associated with the project can access the platform.

#### Acceptance Criteria

1. WHEN the Invite_Checkbox is checked and the form is submitted, THE Backend_Project_Service SHALL send a platform invitation to each client in the Client_List who does not have an existing user account.
2. WHEN the Invite_Checkbox is checked and a client in the Client_List has an existing user account, THE Backend_Project_Service SHALL add that client as a project member and send a project-created notification email instead of an invitation.
3. WHEN the Invite_Checkbox is not checked, THE Backend_Project_Service SHALL create and link Contact_Records for all clients without sending any invitations.
4. IF an invitation fails for one client, THEN THE Backend_Project_Service SHALL continue sending invitations to the remaining clients and log the failure.

### Requirement 7: Payload Structure

**User Story:** As a developer, I want the frontend to send client data in a structured array format, so that the backend can process multiple clients cleanly.

#### Acceptance Criteria

1. WHEN the Project_Creation_Form is submitted, THE Project_Creation_Form SHALL send client data as a JSON array named `clients` where each element contains `email`, `phone`, and `name` fields.
2. THE Backend_Project_Service SHALL accept the `clients` array field in the project creation payload and iterate over each element to create or link Contact_Records.
3. THE Backend_Project_Service SHALL maintain backward compatibility by continuing to accept the single `client_email` field for existing integrations.
