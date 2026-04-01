# Requirements Document: Native Form Engine

## Introduction

This document specifies requirements for a native form engine in the Pylott platform. The form engine replaces the "Form builder coming soon" placeholder in Information Request tasks with a fully functional form builder, template management system, and client-facing form renderer. It enables admins to create reusable form templates with conditional logic and validation rules, attach them to Information Request tasks, and collect structured submissions from clients. The engine integrates with the existing task lifecycle system (specifically the `form_config` JSON column with `mode: 'native'`) and the contacts system for pre-fill capability.

## Glossary

- **Form_Engine**: The complete system responsible for building, storing, rendering, and processing native forms
- **Form_Builder**: The admin-facing UI component for constructing form templates using a structured list-based interface
- **Form_Template**: A reusable form definition belonging to a company, containing an ordered list of Form_Fields with metadata (name, description, status)
- **Form_Field**: A single input element within a Form_Template, defined by its type, label, validation rules, and conditional logic
- **Form_Version**: An immutable snapshot of a Form_Template at a point in time; editing a template creates a new Form_Version while preserving historical versions
- **Form_Submission**: A completed form response submitted by a client, stored as JSON and linked to a specific Form_Version, task, client, and project
- **Conditional_Rule**: A show/hide rule on a Form_Field that evaluates another field's value to determine visibility (e.g., show field B when field A equals "Yes")
- **Validation_Rule**: A constraint on a Form_Field that defines required status, format patterns (email, phone, URL), min/max values, or custom regex
- **Pre_Fill_Engine**: The component that auto-populates Form_Fields using existing client profile data from the contacts table or previously submitted form data
- **Form_Renderer**: The client-facing UI component that renders a Form_Template as an interactive form, evaluates Conditional_Rules, enforces Validation_Rules, and collects submissions
- **Template_Library**: The admin-facing list view for browsing, searching, and managing Form_Templates within a company

## Requirements

### Requirement 1: Form Template CRUD

**User Story:** As an admin, I want to create, read, update, and delete form templates, so that I can build reusable forms for Information Request tasks.

#### Acceptance Criteria

1. WHEN an admin creates a new Form_Template, THE Form_Engine SHALL store the template with: name, description, company_id, created_by, status (draft or published), and an empty fields array
2. THE Form_Engine SHALL enforce that each Form_Template belongs to exactly one company (multi-tenant isolation)
3. WHEN an admin requests the Template_Library, THE Form_Engine SHALL return all Form_Templates belonging to the admin's company, sorted by updated_at descending
4. WHEN an admin updates a Form_Template that has existing Form_Submissions, THE Form_Engine SHALL create a new Form_Version instead of modifying the existing version
5. WHEN an admin deletes a Form_Template that has no Form_Submissions, THE Form_Engine SHALL soft-delete the template by setting a deleted_at timestamp
6. IF an admin attempts to hard-delete a Form_Template that has existing Form_Submissions, THEN THE Form_Engine SHALL reject the deletion with an error message stating that templates with submissions cannot be deleted
7. THE Form_Engine SHALL support searching Form_Templates by name within the Template_Library

### Requirement 2: Form Field Types

**User Story:** As an admin, I want to add various field types to a form template, so that I can collect different kinds of information from clients.

#### Acceptance Criteria

1. THE Form_Builder SHALL support the following Form_Field types: text, textarea, dropdown (single-select), checkboxes (multi-select), radio buttons (single-select), file upload, date picker, and number
2. WHEN an admin adds a Form_Field, THE Form_Builder SHALL require a label and a field type
3. WHEN an admin adds a dropdown, checkboxes, or radio buttons Form_Field, THE Form_Builder SHALL require at least one option value
4. WHEN an admin adds a file upload Form_Field, THE Form_Builder SHALL allow configuring accepted file types and maximum file size
5. WHEN an admin adds a number Form_Field, THE Form_Builder SHALL allow configuring minimum and maximum value constraints
6. THE Form_Builder SHALL store each Form_Field with: id, type, label, placeholder text (optional), help text (optional), sort_order, validation rules, and conditional rules

### Requirement 3: Field Ordering

**User Story:** As an admin, I want to reorder fields within a form template, so that I can control the sequence in which clients see and fill out fields.

#### Acceptance Criteria

1. THE Form_Builder SHALL display Form_Fields in ascending sort_order within a Form_Template
2. WHEN an admin reorders a Form_Field using up/down controls or drag-and-drop, THE Form_Builder SHALL update the sort_order values of all affected fields to reflect the new sequence
3. THE Form_Engine SHALL persist the updated sort_order values to the database in a single transaction

### Requirement 4: Conditional Logic

**User Story:** As an admin, I want to show or hide fields based on answers to other fields, so that clients only see relevant questions.

#### Acceptance Criteria

1. WHEN an admin configures a Conditional_Rule on a Form_Field, THE Form_Builder SHALL require: a source field (the field whose value is evaluated), an operator (equals, not_equals, contains, is_empty, is_not_empty), and a comparison value (for equals, not_equals, contains operators)
2. THE Form_Builder SHALL restrict the source field selection to fields that appear before the target field in sort_order
3. WHEN a Conditional_Rule evaluates to false during form rendering, THE Form_Renderer SHALL hide the target Form_Field and exclude the field's value from the Form_Submission
4. WHEN a Conditional_Rule evaluates to true during form rendering, THE Form_Renderer SHALL show the target Form_Field and include the field's value in the Form_Submission
5. THE Form_Builder SHALL allow a maximum of one Conditional_Rule per Form_Field for the initial release

### Requirement 5: Validation Rules

**User Story:** As an admin, I want to define validation rules on form fields, so that clients submit correctly formatted data.

#### Acceptance Criteria

1. THE Form_Builder SHALL support the following Validation_Rules: required (field must have a value), email format, phone format, URL format, minimum length, maximum length, minimum value (number fields), maximum value (number fields), and custom regex pattern
2. WHEN a client submits a Form_Submission, THE Form_Renderer SHALL validate all visible fields against their configured Validation_Rules before submission
3. IF a field fails validation, THEN THE Form_Renderer SHALL display an inline error message next to the failing field identifying the specific validation failure
4. THE Form_Engine SHALL perform server-side validation of all Validation_Rules on the submitted data, independent of client-side validation
5. IF server-side validation fails, THEN THE Form_Engine SHALL return a 400 response with an array of field-level error messages identifying each failing field and the violated rule

### Requirement 6: Template Versioning

**User Story:** As an admin, I want form template edits to create new versions, so that historical submissions remain linked to the exact form version they were filled against.

#### Acceptance Criteria

1. WHEN a Form_Template is first published, THE Form_Engine SHALL create Form_Version 1 containing a snapshot of all Form_Fields and their configurations
2. WHEN an admin edits a published Form_Template, THE Form_Engine SHALL create a new Form_Version with an incremented version number and store the updated field snapshot
3. THE Form_Engine SHALL store each Form_Version as an immutable JSON snapshot of the template's fields at that point in time
4. WHEN a Form_Submission is created, THE Form_Engine SHALL record the Form_Version number on the submission record
5. WHEN an admin views a historical Form_Submission, THE Form_Engine SHALL render the submission data against the Form_Version that was active when the submission was created
6. THE Form_Engine SHALL allow admins to view a list of all Form_Versions for a given Form_Template, showing version number, created_at, and created_by

### Requirement 7: Template Cloning

**User Story:** As an admin, I want to clone an existing form template, so that I can create new templates based on proven forms without starting from scratch.

#### Acceptance Criteria

1. WHEN an admin clones a Form_Template, THE Form_Engine SHALL create a new Form_Template with the name "{original_name} (Copy)" and copy all Form_Fields, Validation_Rules, and Conditional_Rules from the source template
2. THE Form_Engine SHALL set the cloned template's status to draft regardless of the source template's status
3. THE Form_Engine SHALL assign the cloned template to the same company_id as the source template
4. THE Form_Engine SHALL not copy Form_Versions or Form_Submissions from the source template to the cloned template

### Requirement 8: Pre-Fill from Client Profile

**User Story:** As an admin, I want form fields to auto-populate with existing client data, so that clients do not have to re-enter information the platform already has.

#### Acceptance Criteria

1. WHEN a Form_Field has a pre-fill mapping configured, THE Pre_Fill_Engine SHALL look up the corresponding value from the client's contact record (name, email, phone fields from the contacts table)
2. THE Form_Builder SHALL allow admins to map a Form_Field to a contact profile attribute (name, email, phone) as a pre-fill source
3. WHEN the Pre_Fill_Engine finds a matching value, THE Form_Renderer SHALL populate the Form_Field with the pre-filled value and allow the client to override the value
4. WHEN the Pre_Fill_Engine does not find a matching value, THE Form_Renderer SHALL leave the Form_Field empty for manual entry

### Requirement 9: Pre-Fill from Previous Submissions

**User Story:** As an admin, I want form fields to auto-populate with data from a client's previous form submissions, so that repeat clients have a smoother experience.

#### Acceptance Criteria

1. WHEN a client opens a form and has previous Form_Submissions for the same Form_Template, THE Pre_Fill_Engine SHALL retrieve the most recent submission's data
2. THE Pre_Fill_Engine SHALL match fields by field ID between the current Form_Version and the previous submission's Form_Version
3. WHEN a matching field value is found in the previous submission, THE Form_Renderer SHALL populate the Form_Field with the previous value and allow the client to override the value
4. WHEN a field exists in the current Form_Version but not in the previous submission's Form_Version, THE Form_Renderer SHALL leave the Form_Field empty

### Requirement 10: Form Rendering for Clients

**User Story:** As a client, I want to view and fill out a form attached to an Information Request task, so that I can provide the requested information.

#### Acceptance Criteria

1. WHEN a client opens an Information Request task with form_config mode 'native', THE Form_Renderer SHALL fetch the Form_Template referenced by form_config.form_id and render the latest published Form_Version
2. THE Form_Renderer SHALL display Form_Fields in sort_order with their labels, placeholder text, and help text
3. THE Form_Renderer SHALL evaluate all Conditional_Rules in real-time as the client fills out the form, showing and hiding fields dynamically
4. THE Form_Renderer SHALL validate all visible fields against their Validation_Rules when the client attempts to submit
5. IF any visible field fails validation, THEN THE Form_Renderer SHALL prevent submission and display inline error messages
6. THE Form_Renderer SHALL provide a "Save Draft" capability that persists the client's partial responses without triggering validation

### Requirement 11: Form Submission Storage

**User Story:** As a system, I want to store form submissions with full traceability, so that admins can review responses and link them to the correct task, client, and form version.

#### Acceptance Criteria

1. WHEN a client submits a completed form, THE Form_Engine SHALL create a Form_Submission record containing: submission data (JSON), form_template_id, form_version number, task_id, client_id (contact ID), project_id, company_id, submitted_at timestamp, and status (draft or submitted)
2. THE Form_Engine SHALL store the submission data as a JSON object mapping field IDs to their submitted values
3. THE Form_Engine SHALL validate that the referenced task_id exists and has form_config.mode equal to 'native' before accepting the submission
4. THE Form_Engine SHALL validate that the referenced form_template_id matches the form_config.form_id on the task before accepting the submission
5. WHEN a Form_Submission with status 'draft' is updated, THE Form_Engine SHALL overwrite the existing draft submission data without creating a new record
6. WHEN a Form_Submission is finalized (status changes from draft to submitted), THE Form_Engine SHALL mark the submission as immutable and reject further modifications

### Requirement 12: Submission Viewing by Admin

**User Story:** As an admin, I want to view form submissions within the task detail view, so that I can review the information clients have provided.

#### Acceptance Criteria

1. WHEN an admin views an Information Request task with a submitted Form_Submission, THE Form_Engine SHALL display the submission data rendered against the Form_Version's field definitions (showing labels, values, and field types)
2. THE Form_Engine SHALL display file upload field values as downloadable links
3. WHEN an admin views a task with a draft Form_Submission, THE Form_Engine SHALL indicate that the submission is in draft status and show the partial data
4. THE Form_Engine SHALL display the submission metadata: client name, submitted_at timestamp, and form version number

### Requirement 13: Integration with Information Request Task

**User Story:** As an admin, I want to select a form template when creating an Information Request task with native mode, so that the task is linked to the correct form.

#### Acceptance Criteria

1. WHEN an admin selects mode 'native' in the Information Request task creation form, THE Form_Builder SHALL replace the "Form builder coming soon" placeholder with a template selector dropdown
2. THE template selector SHALL display only published Form_Templates belonging to the admin's company
3. WHEN an admin selects a Form_Template, THE Form_Engine SHALL store the template ID in form_config.form_id on the task record
4. WHEN a client submits the form, THE Form_Engine SHALL optionally auto-transition the task status to 'completed' if the task's auto_complete_on_submit flag is set to true
5. IF no published Form_Templates exist, THEN THE template selector SHALL display a message directing the admin to create a template first

### Requirement 14: Form Template Database Schema

**User Story:** As a developer, I want the database schema to support form templates, versions, fields, and submissions, so that data is stored consistently and efficiently.

#### Acceptance Criteria

1. THE Form_Engine SHALL create a form_templates table with columns: id (primary key), company_id, name, description (nullable), status (enum: draft, published, archived), created_by, created_at, updated_at, deleted_at (nullable)
2. THE Form_Engine SHALL create a form_versions table with columns: id (primary key), template_id (foreign key to form_templates), version_number (integer), fields_snapshot (JSON containing the complete field definitions), created_by, created_at
3. THE Form_Engine SHALL create a form_fields table with columns: id (primary key), template_id (foreign key to form_templates), type (enum of supported field types), label, placeholder (nullable), help_text (nullable), sort_order (integer), validation_rules (JSON, nullable), conditional_rules (JSON, nullable), pre_fill_source (nullable), options (JSON, nullable for select/checkbox/radio types), file_config (JSON, nullable for file upload type)
4. THE Form_Engine SHALL create a form_submissions table with columns: id (primary key), template_id (foreign key to form_templates), version_number (integer), task_id (foreign key to project_tasks), client_id (foreign key to contacts), project_id (foreign key to projects), company_id, submission_data (JSON), status (enum: draft, submitted), submitted_at (nullable), created_at, updated_at
5. THE Form_Engine SHALL create indexes on: form_templates.company_id, form_fields.template_id, form_versions.template_id, form_submissions.task_id, form_submissions.template_id, form_submissions.client_id
6. THE Form_Engine SHALL enforce a unique constraint on (template_id, version_number) in the form_versions table
7. THE Form_Engine SHALL enforce a unique constraint on (task_id, client_id) in the form_submissions table to prevent duplicate submissions per client per task

### Requirement 15: Multi-Tenant Data Isolation

**User Story:** As a platform operator, I want form data to be isolated per company, so that one company cannot access another company's templates or submissions.

#### Acceptance Criteria

1. THE Form_Engine SHALL filter all Form_Template queries by the requesting user's company_id
2. THE Form_Engine SHALL filter all Form_Submission queries by the requesting user's company_id
3. THE Form_Engine SHALL validate that the company_id on a Form_Template matches the requesting user's company_id before allowing read, update, or delete operations
4. IF a user attempts to access a Form_Template or Form_Submission belonging to a different company, THEN THE Form_Engine SHALL return a 403 Forbidden response

### Requirement 16: Form Field Definition Serialization Round-Trip

**User Story:** As a developer, I want form field definitions to survive serialization and deserialization without data loss, so that templates render correctly after storage.

#### Acceptance Criteria

1. FOR ALL valid Form_Field definitions, serializing the field to JSON for storage and deserializing the JSON back to a Form_Field object SHALL produce an equivalent object (round-trip property)
2. FOR ALL valid Form_Version fields_snapshot JSON values, deserializing the snapshot and re-serializing it SHALL produce an identical JSON string
3. FOR ALL valid Conditional_Rule definitions, serializing and deserializing the rule SHALL preserve the source field reference, operator, and comparison value exactly
4. FOR ALL valid Validation_Rule definitions, serializing and deserializing the rule SHALL preserve the rule type, parameters, and error message exactly
