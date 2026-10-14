# Requirements: Missing Documents (client Documents page follow-up)

## Introduction

The client Documents page was redesigned into a scannable table (Document / Status /
Expiry / File) under the `client-ux-redesign` work. The UI/UX reference guide asks
clients to be able to **scan missing documents** — not just the documents that have
already been uploaded.

Today the system has no notion of a document that a project is *expected* to have but
has not yet received. The Documents page can only render `IDocument` records that
already exist. Document *types* exist (`DocumentTypeDetails`, with a `requires_expiry`
flag added by the shipped `client-documents-tasks` spec), and each uploaded document
links to one via `document_type_id` — but nothing marks a document type as *required*
for a given project, so "Missing" cannot be derived from current data.

This spec adds the missing concept: a per-project list of **required document types**,
a derived **Missing** state when a required type has no uploaded document, and the
surfacing of that state on the client Documents page so clients can see at a glance
what they still need to provide.

Out of scope: changing how documents are uploaded (the upload modal and task-linked
upload flow from `client-documents-tasks` are reused as-is); any AI/automation around
document classification.

## Glossary

- **Document type** — `DocumentTypeDetails`: a reusable category (e.g. "Passport",
  "Insurance Certificate") scoped to a company/project. Already carries `requires_expiry`.
- **Required document type** — a document type the project is expected to receive. This
  association does not exist yet and is introduced by this spec.
- **Uploaded document** — `IDocument`, linked to a type via `document_type_id`.
- **Missing** — a required document type for which the project has zero uploaded,
  client-visible documents.

## Requirements

### Requirement 1 — Mark a document type as required for a project (Admin)

**User Story:** As an admin, I want to mark certain document types as required for a
project, so clients know which documents they must provide.

#### Acceptance Criteria

1. WHEN an admin views a project's document configuration THEN the system SHALL allow
   marking each available document type as required or not required for that project.
2. WHEN an admin toggles a document type's required state THEN the system SHALL persist
   that association against the project.
3. WHEN a document type is not marked required THEN the system SHALL treat it as optional
   and SHALL NOT contribute to the Missing count.
4. The required/optional association SHALL be scoped per project (a type required on one
   project is not implicitly required on another).

### Requirement 2 — Derive the Missing state

**User Story:** As a client, I want to see which required documents I have not yet
provided, so I know what is outstanding.

#### Acceptance Criteria

1. The system SHALL compute a document type as **Missing** for a project IF AND ONLY IF
   it is marked required for that project AND the project has zero uploaded,
   client-visible documents linked to that type.
2. WHEN at least one client-visible document is linked to a required type THEN that type
   SHALL NOT be Missing, regardless of the document's expiry status.
3. The Missing computation SHALL be a pure, display-only derivation (no new status column
   on the documents table).
4. An expired document SHALL satisfy its required type (the type is not Missing); expiry
   is surfaced separately by the existing expiry status.

### Requirement 3 — Surface Missing on the client Documents page

**User Story:** As a client, I want missing documents to be easy to scan on my Documents
page, alongside the ones I have.

#### Acceptance Criteria

1. WHEN a project has one or more Missing required types THEN the Documents page SHALL
   show a "Missing" summary count alongside the existing Total / Valid / Expiring / Expired
   stat cards.
2. WHEN the Missing filter is selected THEN the list SHALL show one row per Missing
   required type, labelled with the type name and a "Missing" status pill.
3. A Missing row SHALL show the document type's description as the instruction text (so the
   client understands what to provide) and SHALL offer an action to upload that document.
4. WHEN there are no Missing required types THEN the page SHALL NOT show a Missing count or
   empty Missing section (no false "all clear" noise beyond the existing stats).
5. Missing rows SHALL be visually distinguishable from uploaded documents (e.g. muted/outline
   styling and a dedicated badge variant) and SHALL NOT offer a Download action.

### Requirement 4 — Consistency and safety

#### Acceptance Criteria

1. The Missing status pill and count SHALL use the existing `Badge` component and the
   established colour language (reusing or extending `document-expiry` style helpers), not
   a bespoke style.
2. WHEN the required-types data fails to load THEN the Documents page SHALL still render the
   uploaded-documents table and SHALL degrade gracefully (no Missing section rather than an
   error for the whole page).
3. The feature SHALL NOT change the behaviour of existing uploaded-document rows, search, or
   the Valid / Expiring / Expired counts.
