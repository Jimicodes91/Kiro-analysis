# Requirements Document

## Introduction

This feature redesigns the **client-facing** experience of PYLOTT per the UI/UX reference guide: Home, Journey, Tasks, Documents, and an "Ask Pylott" AI panel. The direction is deliberately calm and action-oriented — the client should always know "what do I need to do" and "where is my project." The reference apps (monday.com, Asana, ClickUp, Google Drive, Notion AI) are directional, not to be copied.

**This is an enhancement, not greenfield.** All four client pages already exist (`src/pages/client/{home,journey,tasks,documents}`), and most of the underlying data is already present. The redesign reshapes layout and surfaces existing data more clearly; two areas need genuinely new work (a project % / completion calc, and the functional AI layer).

## Data-readiness summary (verified against the codebase)

- **Tasks:** status model (`pending`/`in_progress`/`completed`), category types, and the client task-action view already exist. Kanban is a re-layout of existing data.
- **Documents:** expiry utilities (`getDocumentExpiryInfo`, expiry badges), `expiry_date`, `does_not_expire`, `requires_expiry`, and a `description` field all exist. The status pills map to existing `Badge` variants.
- **Journey:** milestones already carry `estimated_start_date`, `estimated_end_date`, `milestone_start_date`, and `milestone_status` — the per-stage timeline dates the design needs largely exist.
- **Home KPIs:** task counts and document/visibility data exist. A single **project % complete** and **estimated completion date** are NOT clearly computed anywhere — small new derivations.
- **Ask Pylott:** no AI layer, retrieval, or backend exists. This is a **mockup**; the functional version is a separate, larger effort gated on data-assembly and PII/compliance decisions.

## Requirements

### Requirement 1: Client Home overview

**User Story:** As a client, I want a single overview showing what needs my attention and overall progress, so I immediately know what to do.

#### Acceptance Criteria

1. THE Home page SHALL show a greeting and three KPI cards: tasks to complete, documents needed, and project progress (%).
2. THE Home page SHALL list "Needs your attention" items (outstanding tasks/documents) with a status indicator (action required vs completed).
3. THE Home page SHALL show the next milestone with its estimated completion date and a progress bar.
4. WHERE project progress or estimated completion is not derivable, THE page SHALL degrade gracefully (hide or show "—") rather than error.

### Requirement 2: Journey timeline

**User Story:** As a client, I want a clear timeline of stages with dates, so I can see where my project is and what's next.

#### Acceptance Criteria

1. THE Journey page SHALL render stages as a horizontal timeline with completed, current, and upcoming states visually distinct.
2. EACH stage SHALL display its start and estimated end date using the milestone `estimated_start_date` / `estimated_end_date` (or equivalents).
3. THE current stage SHALL be clearly marked and SHALL show its outstanding actions.
4. WHERE a stage lacks dates, THE timeline SHALL still render the stage without the missing dates (no error).

### Requirement 3: Tasks board (status-grouped)

**User Story:** As a client, I want tasks grouped by status with clear next actions, so I can quickly act on what matters.

#### Acceptance Criteria

1. THE Tasks page SHALL group tasks into columns by status (e.g. Needs action / In progress / Completed).
2. EACH task SHALL show its name and a short action description.
3. THE tasks SHALL use consistent colour-coded status/urgency labels.
4. WHEN a client clicks a task, THE app SHALL navigate directly to that task's action view.
5. ON small screens, THE columns SHALL collapse to a stacked or tabbed layout (no horizontal overflow).

### Requirement 4: Documents list

**User Story:** As a client, I want to scan document status and expiry at a glance and understand what each document is for.

#### Acceptance Criteria

1. THE Documents page SHALL list documents with columns for name, status, and expiry.
2. STATUS SHALL be colour-coded: Valid, Does not expire, Expiring soon, Missing — mapped to existing Badge variants.
3. EACH document SHALL display a short description/instruction when present (using the existing `description` field).
4. EXPIRY SHALL show the date, or "—" when not applicable.

### Requirement 5: Ask Pylott (AI) — visual placeholder now, functional later

**User Story:** As a client, I want to ask simple questions about my project and get helpful answers.

#### Acceptance Criteria

1. THE Ask Pylott panel SHALL be presented as a contained assistant (not an interface takeover), with a prompt input and message area.
2. INITIALLY, THE panel MAY be a non-functional visual placeholder clearly scoped as such.
3. THE functional version SHALL be specified separately, with its context-assembly, retrieval, cost, and client-PII handling resolved before implementation.
4. THE panel SHALL NOT imply capabilities that are not implemented (e.g. no fake "answers" presented as real in production).

### Requirement 6: Visual system & consistency

#### Acceptance Criteria

1. THE redesign SHALL reuse existing components (`Badge`, `Modal`, `Toast`, form primitives) and status/colour conventions.
2. COLOUR SHALL be used to aid clarity (status/urgency) while keeping the layout uncluttered.
3. ALL client pages SHALL have consistent loading, empty, and error states.
4. ALL client pages SHALL be responsive (usable on mobile).

## Gaps requiring new work (flag to the team)

| Area | New work | Size |
|---|---|---|
| Home | Compute **% complete** + **estimated completion** for the project | Small |
| Journey | Confirm milestone dates are populated for real projects (fields exist) | Small/verify |
| Tasks | Mobile fallback for the Kanban columns | Small |
| Documents | Surface the existing `description` field in the UI | Trivial |
| Ask Pylott | **Entire functional AI layer** (context, retrieval, PII, cost) | Large — separate spec |

## Open Questions

- How is **project progress %** defined — completed milestones / total, completed tasks / total, or a weighted mix? (Needed for Home + Journey.)
- Are milestone `estimated_start_date` / `estimated_end_date` reliably populated for live projects, or only on templates?
- Is **Ask Pylott** approved to be built functionally, and if so under what data-handling/PII constraints? (See the earlier automation/AI-readiness discussion.)
- Accessibility bar (keyboard nav, contrast, focus management) — target WCAG level?
