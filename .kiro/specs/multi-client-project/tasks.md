# Implementation Plan: Multi-Client Project

## Overview

Transform the project creation flow from single-client to multi-client by updating the frontend form with a dynamic `useFieldArray`-based client list and updating the backend to process a `clients[]` array with duplicate detection, find-or-create contact logic, and multi-client invite flow. All changes are modifications to existing files — no new files or services needed.

## Tasks

- [x] 1. Update backend types and service for multi-client support
  - [x] 1.1 Add `clients` array field to `CreateProjectType` in `projects.type.ts`
    - Add `clients?: Array<{ email: string; phone: string; name?: string }>` to the type
    - _Requirements: 7.2, 7.3_

  - [x] 1.2 Add backend duplicate email validation in `projects.service.ts`
    - At the start of `createProject`, if `payload.clients` exists, extract emails, lowercase them, and check for duplicates
    - Return HTTP 400 with a descriptive error message identifying the duplicated email
    - _Requirements: 5.1, 5.2_

  - [x] 1.3 Implement multi-client contact creation loop in `projects.service.ts`
    - If `payload.clients` is present and is an array, iterate over each entry to find-or-create a contact using the existing single-client logic
    - Add each resulting contact ID to the `project_client` array in `form_data`
    - Fall back to existing `client_email` logic when `clients` is absent (backward compatibility)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 7.2, 7.3_

  - [x] 1.4 Extend invite flow to handle multiple clients in `projects.service.ts`
    - Ensure the existing invite logic (which iterates `nonExistentClients` and `existentClients`) is populated from all clients in the array
    - If `send_client_invite` is true, send invites/notifications for each client
    - If an invite fails for one client, log the error and continue with remaining clients
    - When `send_client_invite` is false, skip all invites
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 1.5 Write property test: Backend processes N clients into N contact IDs
    - **Property 7: Backend processes N clients into N contact IDs**
    - Generate random N (1–10) unique client entries, mock DB, verify `project_client` has N IDs
    - **Validates: Requirements 4.1, 4.4, 7.2**

  - [ ]* 1.6 Write property test: Backend duplicate email rejection
    - **Property 9: Backend duplicate email rejection**
    - Generate random payloads with intentional case-insensitive duplicates, verify 400 response with email in message
    - **Validates: Requirements 5.1, 5.2**

  - [ ]* 1.7 Write property test: Invite action depends on user account existence
    - **Property 10: Invite action depends on user account existence**
    - Generate random client sets with mixed account status, verify correct invite vs notification behavior
    - **Validates: Requirements 6.1, 6.2**

  - [ ]* 1.8 Write property test: No invites when checkbox unchecked
    - **Property 11: No invites when checkbox unchecked**
    - Generate random client sets with `send_client_invite=false`, verify zero invite calls
    - **Validates: Requirements 6.3**

- [ ] 2. Checkpoint — Ensure backend changes compile and tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Update frontend form schema and hook for multi-client support
  - [x] 3.1 Update Yup schema in `simplified-project-form.tsx`
    - Replace flat `client_email`, `client_phone`, `client_name` fields with a `clients` array schema
    - Each entry: `email` (required, valid email), `phone` (required), `name` (optional)
    - Add `.test()` on the `clients` array for case-insensitive duplicate email detection
    - Set default values to `[{ email: "", phone: "", name: "" }]`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

  - [x] 3.2 Add `useFieldArray` for dynamic client list in `simplified-project-form.tsx`
    - Use `useFieldArray({ control, name: "clients" })` to manage dynamic client rows
    - Render each client entry with email, phone, name fields
    - Show a remove button on all entries except the first (index 0)
    - Show an "Add another client" button below the list
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 3.3 Update payload mapping in `onSubmit` handler
    - Map `data.clients` to the `clients` JSON array in the payload
    - Set `client_email` to the first client's email for backward compatibility
    - _Requirements: 7.1_

  - [x] 3.4 Update `CreateSimplifiedProjectSchema` type in `use-create-simplified-project.tsx`
    - Add `clients: Array<{ email: string; phone: string; name?: string }>` to the schema type
    - _Requirements: 7.1_

  - [ ]* 3.5 Write property test: Add/remove operations change client list size
    - **Property 1: Add/remove operations change client list size**
    - Generate random list sizes, apply add/remove, verify size changes by ±1
    - **Validates: Requirements 1.2, 1.4**

  - [ ]* 3.6 Write property test: Client entry validation rules
    - **Property 4: Client entry validation rules**
    - Generate random client arrays with valid/invalid emails and phones, verify schema passes/fails correctly
    - **Validates: Requirements 2.1, 2.2, 2.3**

  - [ ]* 3.7 Write property test: Case-insensitive duplicate email detection
    - **Property 6: Case-insensitive duplicate email detection**
    - Generate random email pairs differing only in case, verify schema rejects
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [ ]* 3.8 Write property test: Frontend payload structure
    - **Property 12: Frontend payload structure**
    - Generate random form data, verify payload transformation produces correct `clients[]` structure
    - **Validates: Requirements 7.1**

- [ ] 4. Checkpoint — Ensure frontend changes compile and tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Wire everything together and verify end-to-end
  - [ ] 5.1 Verify backward compatibility with single `client_email` field
    - Confirm backend still processes `client_email` when `clients` array is absent
    - _Requirements: 7.3_

  - [ ] 5.2 Verify form renders correctly with one default client entry on load
    - Confirm initial render shows one Client_Entry with email, phone, name fields
    - _Requirements: 1.1_

  - [ ]* 5.3 Write property test: Backend find-or-create contact idempotence
    - **Property 8: Backend find-or-create contact idempotence**
    - Generate random client emails, pre-populate some as existing contacts, verify reuse vs creation
    - **Validates: Requirements 4.2, 4.3**

- [ ] 6. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All code is TypeScript (React frontend, Node/Express backend)
- Use `fast-check` for property-based tests on both frontend and backend
- No new files are created — all changes modify existing files
- Backend changes go in `Pylott-Backend`, frontend changes in `Pylott-Web-App`
- Use `strReplace` for file modifications, `--no-verify` on frontend commits
