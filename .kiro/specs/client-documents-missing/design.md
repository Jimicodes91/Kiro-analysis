# Design: Missing Documents

## Overview

This design adds a **required document types** association per project and a pure,
display-only **Missing** derivation, then surfaces it on the already-redesigned client
Documents table. It reuses the `requires_expiry` groundwork and the task-linked upload
flow from the shipped `client-documents-tasks` spec; it does **not** change how documents
are uploaded.

The core idea: a document type is *Missing* for a project when it is **required** for that
project and the project has **no client-visible uploaded document** linked to it. The only
genuinely new data is the per-project "required" association — everything else is derived.

## Current state (grounding)

- `DocumentTypeDetails` (`src/types/api.types.ts`): `id, company_id, project_id, name,
  is_system, type, description, requires_expiry`. No "required for project" flag.
- `IDocument`: links to a type via `document_type_id`; has `is_visible_to_client`.
- Document types are fetched via the `GET_DOCUMENT_TYPES` endpoint
  (`metadata/type/documents`) / `GET_DOCUMENT_TYPES` query key (`src/lib/constants.ts`).
- `is_required` exists only for **project form fields**, never for documents — so there is
  no existing concept to reuse for required documents.
- The client Documents list (`src/pages/client/documents/components/client-document-list.tsx`)
  already renders uploaded docs in a table with Total / Valid / Expiring / Expired stats,
  search, and status filters, and already surfaces each document's description.

## Data model

### Option A (recommended): a boolean on the per-project document type

Document types are already project-scoped (`DocumentTypeDetails.project_id`). Add a single
boolean so "required" rides along with the type the admin already configures:

- Backend (`/Users/jimi/pylott-backend/`): add
  `is_required_for_project BOOLEAN NOT NULL DEFAULT false` to the `metadata` document-type
  record (mirrors how `requires_expiry` was added in `client-documents-tasks`). Persist it
  in the document-type create/update service. No new table.
- Frontend: add `is_required_for_project: boolean` to `DocumentTypeDetails`.

Trade-off: simplest, mirrors the existing `requires_expiry` pattern exactly. Works because
document types are already per-project. If a company later wants *global* reusable types,
this would need revisiting (see Option B).

### Option B (if types become company-global later): a join table

A `project_required_documents` join (`project_id`, `document_type_id`) if/when document
types stop being project-scoped. More flexible, more plumbing. **Not** proposed now; noted
so the Option A boolean is a conscious, reversible choice.

**Decision:** Option A, because document types are already project-scoped today and it
reuses the proven `requires_expiry` migration/service pattern. Flagged for confirmation.

## Derivation (pure, frontend)

New utility `src/utils/missing-documents.ts`:

```ts
export interface MissingDocType {
  documentTypeId: string;
  name: string;
  description: string;
}

// A required type is Missing iff it has zero client-visible uploaded docs.
export function getMissingDocumentTypes(
  requiredTypes: DocumentTypeDetails[],   // already filtered to is_required_for_project
  documents: IDocument[]
): MissingDocType[];
```

- Build a `Set` of `document_type_id` from documents where `is_visible_to_client` is truthy.
- A required type is Missing iff its `id` is not in that set.
- Expired docs still count as "present" (satisfies Req 2.4) — expiry is a separate axis.
- Pure function → property-testable with `fast-check` (mirrors the `document-expiry` and
  `task-display-status` utilities already in the repo).

## UI changes (client Documents page)

File: `client-document-list.tsx` (already a table; additive changes only).

1. **Data:** fetch document types for the project (reuse the `GET_DOCUMENT_TYPES` hook),
   filter to `is_required_for_project`, pass with `documents` into `getMissingDocumentTypes`.
2. **Stats:** add a 5th stat card "Missing" (count = missing types), tone red/neutral.
   Keep the existing four unchanged (Req 4.3).
3. **Filter:** add a "Missing" filter pill. Selecting it renders Missing rows instead of
   uploaded-document rows.
4. **Missing rows:** render in the same table columns —
   - Document: type name + its `description` as instruction text.
   - Status: a "Missing" `Badge` (new variant/label; extend the expiry style helpers or add
     a small `getMissingBadge*` helper so colour language stays consistent — Req 4.1).
   - Expiry: "—" (not applicable).
   - File: an **Upload** action (opens the existing `UploadDocumentModal`, optionally
     pre-selecting the type), not a Download (Req 3.5).
   - Muted/outline row styling to distinguish from uploaded docs (Req 3.5).
5. **Graceful degradation:** if the required-types query errors, skip the Missing count and
   section; still render the uploaded-documents table (Req 4.2).

### Default list composition

- When filter = **All**: show uploaded documents as today. Missing items are represented by
  the Missing stat card; optionally append Missing rows beneath uploaded rows (confirm with
  design — keeping All = uploaded-only is the conservative default).
- When filter = **Missing**: show only the Missing-type rows.

## Admin changes

Reuse the admin document-type configuration surface that already hosts the `requires_expiry`
toggle (`add-document-type-model.tsx` and its hooks, per `client-documents-tasks` task 1.5):

- Add a "Required for this project" toggle (Switch) seeded from
  `documentType?.is_required_for_project ?? false`.
- Thread `is_required_for_project` through the create/update mutation payloads.

## Backend coordination (`/Users/jimi/pylott-backend/`)

Mirrors the `requires_expiry` work:
- Migration: add `is_required_for_project BOOLEAN NOT NULL DEFAULT false` to the document-type
  `metadata` record. Run with the backend migration runner (separate from this workspace).
- Persist it in the document-type create/update service; keep the existing response shape.

## Testing strategy

- **Property — Missing derivation:** generate arbitrary required-type sets and document sets
  (varying `document_type_id` and `is_visible_to_client`); assert a type is Missing iff no
  client-visible document links to it; assert expired-but-present types are not Missing.
  `fast-check` + `vitest`, ≥100 iterations, tagged `// Feature: client-documents-missing`.
- **Example — stats/filter:** render the list with a mix of uploaded + required types; assert
  the Missing count and that the Missing filter shows one row per missing type with an Upload
  action and no Download.
- **Example — graceful degradation:** required-types query in error state still renders the
  uploaded table.
- Verify: `tsc -b` 0 errors + `vite build` (repo convention this session).

## Risks / decisions to confirm

1. **Data model (Option A vs B).** Recommending the per-project boolean; confirm document
   types stay project-scoped.
2. **All-tab composition.** Whether Missing rows also appear under All, or only under the
   Missing filter + stat card. Conservative default: Missing filter + stat only.
3. **Backend dependency.** The Missing feature is inert until the backend persists
   `is_required_for_project`; frontend can ship behind the data (zero required types ⇒ no
   Missing UI, which is the correct no-op).
