# Implementation Plan: Missing Documents

## Overview

Add a per-project **required document type** association and a pure **Missing** derivation,
then surface it on the already-redesigned client Documents table. Reuses the `requires_expiry`
pattern and admin document-type surface from the shipped `client-documents-tasks` spec.

**Backend tasks live in the sibling repo `/Users/jimi/pylott-backend/`** and are called out
explicitly (migration + service persistence). The Missing UI is a no-op until the backend
persists `is_required_for_project`, so the frontend can ship first safely.

Tasks marked `*` are optional (tests) and can be deferred for a faster MVP.

## Tasks

- [ ] 1. Data model — required document type
  - [ ] 1.1 Backend: add `is_required_for_project` to the document-type record
        _(sibling repo `/Users/jimi/pylott-backend/`)_
    - Migration adding `is_required_for_project BOOLEAN NOT NULL DEFAULT false` to the
      document-type `metadata` record; run with the backend migration runner
    - Persist it in the document-type create/update service; keep the existing response shape
    - _Requirements: 1.1, 1.2, 1.4_
  - [ ] 1.2 Frontend: add `is_required_for_project: boolean` to `DocumentTypeDetails`
        in `src/types/api.types.ts`
    - _Requirements: 1.1, 1.2_
  - [ ] 1.3 Frontend: thread the flag through the document-type create/update hooks + schema
    - Extend the admin document-type schema and the create/update mutation payload types
    - _Requirements: 1.1, 1.2, 1.4_

- [ ] 2. Admin — "Required for this project" toggle
  - [ ] 2.1 Add a Switch `FormField` to the add/edit document-type modal
        (`src/pages/Home/Admin/Document/add-document-type-model.tsx`), seeded from
        `documentType?.is_required_for_project ?? false`, threaded through both submit payloads
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 3. Derivation utility
  - [ ] 3.1 Create `src/utils/missing-documents.ts` exporting `MissingDocType` and
        `getMissingDocumentTypes(requiredTypes, documents)`
    - A required type is Missing iff no client-visible (`is_visible_to_client` truthy) document
      links to it via `document_type_id`; expired-but-present types are NOT Missing
    - Pure function, no React
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [ ]* 3.2 Property test for the Missing derivation
    - Generate arbitrary required-type sets + document sets (varying `document_type_id`,
      `is_visible_to_client`, and expiry); assert Missing iff no client-visible linked doc, and
      that expired-but-present types are not Missing
    - `fast-check` + `vitest`, ≥100 iterations, tag `// Feature: client-documents-missing`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 4. Surface Missing on the client Documents page
  - [ ] 4.1 Fetch project document types in `client-document-list.tsx` (reuse the
        `GET_DOCUMENT_TYPES` hook), filter to `is_required_for_project`, compute Missing types
    - Degrade gracefully: on required-types query error, skip Missing UI, keep the table
    - _Requirements: 3.1, 4.2_
  - [ ] 4.2 Add the "Missing" stat card (5th card) and "Missing" filter pill
    - Hide the Missing count when there are zero missing types (Req 3.4)
    - _Requirements: 3.1, 3.4, 4.3_
  - [ ] 4.3 Render Missing rows under the Missing filter
    - Same columns: type name + description (instruction), "Missing" status pill, Expiry "—",
      and an **Upload** action (opens existing `UploadDocumentModal`, pre-select type if feasible)
    - Muted/outline styling; no Download action
    - _Requirements: 3.2, 3.3, 3.5_
  - [ ] 4.4 Add a consistent "Missing" badge style
    - Reuse `Badge` and extend the `document-expiry` style helpers (or a small
      `getMissingBadge*` helper) so colour language stays consistent
    - _Requirements: 4.1_
  - [ ]* 4.5 Example tests: stats + filter + graceful degradation
    - Mixed uploaded + required types: assert Missing count, Missing filter shows one row per
      missing type with Upload (no Download); required-types error still renders the table
    - _Requirements: 3.1, 3.2, 3.5, 4.2_

- [ ] 5. Checkpoint — verify
  - `tsc -b` → 0 errors; `vite build` passes; run any new tests
  - Commit on a feature branch (do not merge to `v1` without review, per the current workflow)

## Notes

- **Backend coordination required** (sibling repo): migration + service persistence of
  `is_required_for_project` (task 1.1). Until then the Missing UI is correctly inert (zero
  required types ⇒ no Missing section).
- **Open decisions (see design.md):** per-project boolean (Option A) vs join table (Option B);
  whether Missing rows also appear under the All filter or only under the Missing filter + stat
  card (conservative default: Missing filter + stat only).
- Follows the repo's existing patterns: pure display-only derivation like `task-display-status`
  / `document-expiry`; admin toggle like `requires_expiry` from `client-documents-tasks`.
