# Implementation Plan: Native Form Engine

## Overview

Build a complete native form engine for the Pylott platform: 4 database tables, backend module with 6 services and 17 API endpoints, and frontend components for template management, form rendering, and submission viewing. Implementation proceeds bottom-up: database → models → services → routes → frontend hooks → UI components → integration wiring.

## Tasks

- [x] 1. Database migration and Objection.js models
  - [x] 1.1 Create the database migration file for all 4 form engine tables
    - Create `Pylott-Backend/migrations/YYYYMMDD000000_create_form_engine_tables.ts`
    - Create `form_templates`, `form_versions`, `form_fields`, `form_submissions` tables with all columns, indexes, and unique constraints as specified in the design
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

  - [x] 1.2 Create the four Objection.js models
    - Create `Pylott-Backend/src/modules/forms/models/form-template.model.ts` extending BaseModel with relationMappings to fields and versions
    - Create `Pylott-Backend/src/modules/forms/models/form-version.model.ts` extending BaseModel
    - Create `Pylott-Backend/src/modules/forms/models/form-field.model.ts` extending BaseModel
    - Create `Pylott-Backend/src/modules/forms/models/form-submission.model.ts` extending BaseModel
    - Follow existing Pylott model patterns (BaseModel provides id, created_at, updated_at, deleted_at, UUID generation)
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 2. Shared TypeScript interfaces and DTOs
  - [x] 2.1 Create the shared types and DTOs file
    - Create `Pylott-Backend/src/modules/forms/forms.dto.ts`
    - Define all TypeScript interfaces: `FormFieldType`, `FormTemplateStatus`, `FormSubmissionStatus`, `ConditionalOperator`, `ConditionalRule`, `ValidationRule`, `FileConfig`, `FormFieldDefinition`, `FieldError`
    - Define all DTOs: `CreateTemplateDto`, `UpdateTemplateDto`, `CreateFieldDto`, `UpdateFieldDto`, `CreateSubmissionDto`, `UpdateSubmissionDto`
    - _Requirements: 2.1, 2.6, 4.1, 5.1_

- [x] 3. Conditional logic evaluator (shared pure function)
  - [x] 3.1 Implement the conditional evaluation engine
    - Create `Pylott-Backend/src/modules/forms/services/conditional-evaluator.ts`
    - Implement `evaluateCondition(rule, fieldValues)` as a pure function supporting operators: equals, not_equals, contains, is_empty, is_not_empty
    - This function is used by both FormValidationService (server) and will be duplicated on the frontend in `conditional-evaluator.ts`
    - _Requirements: 4.1, 4.3, 4.4_

  - [ ]* 3.2 Write property test for conditional evaluation (Property 10)
    - **Property 10: Conditional evaluation determines field inclusion in submission**
    - **Validates: Requirements 4.3, 4.4**

- [x] 4. FormValidationService
  - [x] 4.1 Implement the validation service
    - Create `Pylott-Backend/src/modules/forms/services/form-validation.service.ts`
    - Implement `validateSubmission(fields_snapshot, submission_data, conditional_context)` that evaluates conditional rules to determine visible fields, then validates each visible field against its validation_rules
    - Support all validation rule types: required, email, phone, url, min_length, max_length, min_value, max_value, regex
    - Return `{ valid, errors: FieldError[] }` with field_id, field_label, rule_type, and message for each violation
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

  - [ ]* 4.2 Write property test for validation engine (Property 11)
    - **Property 11: Validation engine identifies all rule violations for visible fields**
    - **Validates: Requirements 5.2, 5.4, 5.5**

- [x] 5. FormTemplateService
  - [x] 5.1 Implement the template service
    - Create `Pylott-Backend/src/modules/forms/services/form-template.service.ts`
    - Implement `create`, `getAll` (with search, sorted by updated_at desc), `getById`, `update`, `delete` (soft-delete with submission check), `clone` (copy fields, set draft, name + " (Copy)"), `publish` (delegates to FormVersionService)
    - All queries filter by company_id for multi-tenant isolation
    - Return ServiceType objects following existing Pylott patterns
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 7.1, 7.2, 7.3, 7.4, 15.1, 15.3_

  - [ ]* 5.2 Write property tests for template service (Properties 3, 4, 5, 15, 18)
    - **Property 3: Template listing returns only company-scoped results sorted by updated_at**
    - **Property 4: Template name search filters correctly**
    - **Property 5: Multi-tenant isolation rejects cross-company access**
    - **Property 15: Clone produces a draft copy with no versions or submissions**
    - **Property 18: Soft-delete sets deleted_at without removing the record**
    - **Validates: Requirements 1.3, 1.5, 1.6, 1.7, 7.1–7.4, 15.1–15.4**

- [x] 6. FormFieldService
  - [x] 6.1 Implement the field service
    - Create `Pylott-Backend/src/modules/forms/services/form-field.service.ts`
    - Implement `getByTemplate` (sorted by sort_order asc), `create` (validate required attrs per type, validate conditional rule source ordering), `update`, `delete`, `reorder` (transactional sort_order update)
    - Validate that dropdown/checkboxes/radio require at least one option
    - Validate conditional rule source field sort_order < target field sort_order
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 4.2, 4.5_

  - [ ]* 6.2 Write property tests for field service (Properties 6, 7, 8, 9)
    - **Property 6: Field creation validates required attributes per type**
    - **Property 7: Fields are returned in ascending sort_order**
    - **Property 8: Reorder preserves field set and produces valid ordering**
    - **Property 9: Conditional rule source field ordering constraint**
    - **Validates: Requirements 2.2, 2.3, 3.1, 3.2, 4.2**

- [x] 7. FormVersionService
  - [x] 7.1 Implement the version service
    - Create `Pylott-Backend/src/modules/forms/services/form-version.service.ts`
    - Implement `createVersion` (snapshot current fields, increment version_number), `getVersions`, `getVersion`, `getLatestVersion`
    - Version number increments monotonically; fields_snapshot is an immutable JSON copy of current form_fields
    - _Requirements: 6.1, 6.2, 6.3, 6.6_

  - [ ]* 7.2 Write property tests for version service (Properties 12, 13)
    - **Property 12: Version number increments monotonically on publish**
    - **Property 13: Version snapshot matches template fields at creation time**
    - **Validates: Requirements 6.2, 6.3**

- [x] 8. PreFillService
  - [x] 8.1 Implement the pre-fill service
    - Create `Pylott-Backend/src/modules/forms/services/pre-fill.service.ts`
    - Implement `getPreFillData(client_id, template_id, version_number)` that merges contact profile data (name, email, phone) with most recent previous submission data, matched by field ID
    - Contact profile pre-fill uses the existing ContactService
    - Previous submission pre-fill queries form_submissions for the same template_id and client_id, ordered by created_at desc
    - _Requirements: 8.1, 8.2, 9.1, 9.2, 9.3, 9.4_

  - [ ]* 8.2 Write property tests for pre-fill service (Properties 16, 17)
    - **Property 16: Pre-fill from contact profile returns correct attribute values**
    - **Property 17: Pre-fill from previous submission uses most recent and matches by field ID**
    - **Validates: Requirements 8.1, 9.1, 9.2**

- [x] 9. FormSubmissionService
  - [x] 9.1 Implement the submission service
    - Create `Pylott-Backend/src/modules/forms/services/form-submission.service.ts`
    - Implement `create` (validate task exists with native mode, validate template matches task's form_config.form_id, run server-side validation for submitted status, skip validation for draft status)
    - Implement `update` (overwrite draft in place, reject updates to submitted submissions)
    - Implement `getByTask`, `getByTemplate` (both filtered by company_id)
    - Implement `finalize` (change draft→submitted, set submitted_at, mark immutable, optionally auto-complete task if auto_complete_on_submit flag is set)
    - Enforce unique constraint on (task_id, client_id)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 13.4, 15.2_

  - [ ]* 9.2 Write property tests for submission service (Properties 14, 19, 20, 21, 22, 25)
    - **Property 14: Submission records the active version number**
    - **Property 19: Submission reference validation rejects invalid task or template mismatch**
    - **Property 20: Draft submission overwrites in place**
    - **Property 21: Finalized submission is immutable**
    - **Property 22: Save draft bypasses validation**
    - **Property 25: Auto-complete on submit transitions task status**
    - **Validates: Requirements 6.4, 10.6, 11.3–11.6, 13.4**

- [ ] 10. Checkpoint - Backend services complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Controller and routes
  - [x] 11.1 Create the forms controller
    - Create `Pylott-Backend/src/modules/forms/forms.controller.ts`
    - Implement request handlers for all 17 API endpoints, delegating to the appropriate services
    - Extract company_id and user_id from the authenticated request (following existing Pylott controller patterns)
    - Use `genericResponse` for all responses
    - Return 400 with field-level errors array for validation failures
    - _Requirements: 5.5, 15.3, 15.4_

  - [x] 11.2 Create the forms route file and register in entrypoint
    - Create `Pylott-Backend/src/modules/forms/forms.route.ts` with all 17 endpoint definitions using `authGuard`
    - Register the forms routes in `Pylott-Backend/src/shared/routes/entrypoint.ts` at prefix `/api/v1/forms`
    - _Requirements: 15.1, 15.2_

- [ ] 12. Checkpoint - Backend API complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Frontend hooks
  - [ ] 13.1 Create form template hooks
    - Create `Pylott-Web-App/src/hooks/forms/use-form-templates.ts` — TanStack Query hook to list/search templates
    - Create `Pylott-Web-App/src/hooks/forms/use-form-template.ts` — hooks for create, update, delete, clone, publish template mutations using `useCustomMutation`
    - _Requirements: 1.1, 1.3, 1.5, 1.7, 7.1_

  - [ ] 13.2 Create form field hooks
    - Create `Pylott-Web-App/src/hooks/forms/use-form-fields.ts` — hooks for field CRUD and reorder mutations
    - _Requirements: 2.1, 3.2_

  - [ ] 13.3 Create form version, submission, and pre-fill hooks
    - Create `Pylott-Web-App/src/hooks/forms/use-form-versions.ts` — TanStack Query hook to list versions
    - Create `Pylott-Web-App/src/hooks/forms/use-form-submission.ts` — hooks for create/update/finalize submission mutations
    - Create `Pylott-Web-App/src/hooks/forms/use-form-prefill.ts` — TanStack Query hook to fetch pre-fill data
    - _Requirements: 6.6, 10.6, 11.1_

- [ ] 14. Frontend conditional evaluator and field renderer
  - [ ] 14.1 Create the client-side conditional evaluator
    - Create `Pylott-Web-App/src/components/forms/conditional-evaluator.ts`
    - Port the same `evaluateCondition` pure function from the backend
    - _Requirements: 4.3, 4.4, 10.3_

  - [ ] 14.2 Create the field renderer component
    - Create `Pylott-Web-App/src/components/forms/field-renderer.tsx`
    - Render a single form field based on its `FormFieldType`: text (Input), textarea (Textarea), dropdown (Select), checkboxes (Checkbox group), radio (RadioGroup), file_upload (file input), date (date picker), number (Input type=number)
    - Display label, placeholder, help_text; integrate with react-hook-form for value binding and inline validation error display
    - _Requirements: 2.1, 5.3, 10.2_

- [ ] 15. Template Library page (admin)
  - [ ] 15.1 Create the template library page
    - Create `Pylott-Web-App/src/pages/Home/Admin/forms/template-library.tsx`
    - Display a searchable list of form templates for the admin's company
    - Each row shows template name, status, updated_at, and action buttons (edit, clone, delete)
    - "Create Template" button opens a creation flow
    - Search input filters templates by name
    - _Requirements: 1.3, 1.7, 7.1_

- [ ] 16. Form Builder page (admin)
  - [ ] 16.1 Create the form builder page
    - Create `Pylott-Web-App/src/pages/Home/Admin/forms/form-builder.tsx`
    - Admin page at route for editing a template's fields
    - Display fields as an ordered list with type icon, label, and action buttons (edit, delete, move up/down)
    - "Add Field" button opens the FieldEditor modal
    - "Publish" button triggers version creation
    - Template metadata (name, description) editable at the top
    - _Requirements: 2.1, 3.1, 3.2, 6.1, 6.2_

  - [ ] 16.2 Create the field editor modal
    - Create `Pylott-Web-App/src/components/forms/field-editor.tsx`
    - Modal for configuring a single field: type selector, label, placeholder, help_text
    - Type-specific sections: options list editor for dropdown/checkboxes/radio, file config for file_upload, min/max for number
    - Validation rules section: toggle required, select format validations, set min/max length/value, custom regex
    - Conditional rule section: source field dropdown (only fields before current in sort_order), operator selector, comparison value input
    - Pre-fill source mapping: dropdown to select contact attribute (name, email, phone)
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 4.5, 5.1, 8.2_

- [ ] 17. Form Renderer (client-facing)
  - [ ] 17.1 Create the form renderer component
    - Create `Pylott-Web-App/src/components/forms/form-renderer.tsx`
    - Client-facing component using react-hook-form for state management
    - Fetch the template's latest published version and pre-fill data
    - Render all fields via FieldRenderer in sort_order
    - Evaluate conditional rules on every field value change using the conditional evaluator, showing/hiding fields dynamically
    - "Save Draft" button saves without validation; "Submit" button runs full validation then submits
    - Display inline validation errors from both client-side and server-side (map server 400 errors to react-hook-form setError)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 8.3, 8.4, 9.3, 9.4_

- [ ] 18. Template Selector and task integration
  - [ ] 18.1 Create the template selector component
    - Create `Pylott-Web-App/src/components/forms/template-selector.tsx`
    - Select dropdown of published templates for the admin's company
    - On selection, stores template ID in form_config.form_id
    - If no published templates exist, display message directing admin to create one first
    - _Requirements: 13.1, 13.2, 13.3, 13.5_

  - [ ] 18.2 Integrate template selector into info-request-fields.tsx
    - Modify `Pylott-Web-App/src/pages/Home/Task/type-fields/info-request-fields.tsx`
    - Replace the "Form builder coming soon" placeholder div with the TemplateSelector component when mode is 'native'
    - _Requirements: 13.1_

  - [ ] 18.3 Integrate form renderer into client-task-view.tsx
    - Modify `Pylott-Web-App/src/pages/client/tasks/client-task-view.tsx`
    - When task has `form_config.mode === 'native'`, render the FormRenderer component with the template ID, task ID, client ID, and project ID
    - _Requirements: 10.1_

- [ ] 19. Submission Viewer (admin)
  - [ ] 19.1 Create the submission viewer component
    - Create `Pylott-Web-App/src/pages/Home/Admin/forms/submission-viewer.tsx`
    - Render submitted data as read-only field labels + values using the version's field definitions
    - Show file upload values as downloadable links
    - Display submission metadata: client name, submitted_at, version number, status badge (draft/submitted)
    - Integrate into the task detail view for Information Request tasks with native form submissions
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 20. Version history view
  - [ ] 20.1 Add version history to the form builder page
    - Add a versions panel/tab to the form builder page showing all versions for the template
    - Display version number, created_at, created_by for each version
    - Allow viewing a specific version's fields_snapshot as read-only
    - _Requirements: 6.5, 6.6_

- [ ] 21. Checkpoint - Full feature integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 22. Property-based test setup and serialization tests
  - [ ]* 22.1 Write property tests for serialization round-trips (Properties 1, 2)
    - **Property 1: Field definition serialization round-trip**
    - **Property 2: Version snapshot round-trip**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.4**

  - [ ]* 22.2 Write property test for published template selector (Property 24)
    - **Property 24: Published template selector returns only published templates for company**
    - **Validates: Requirements 13.2**

  - [ ]* 22.3 Write property test for template update with submissions (Property 23)
    - **Property 23: Template update with submissions creates new version**
    - **Validates: Requirements 1.4**

- [ ] 23. Final checkpoint - All tasks complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Backend uses existing Pylott patterns: `@injectable()` services, `ServiceType` returns, `genericResponse` in controllers, `authGuard` on routes
- Frontend uses existing Pylott patterns: `useCustomMutation`, TanStack Query, react-hook-form, Radix UI components, Tailwind styling
- The conditional evaluator is implemented as a pure function on both client and server for consistency
