# Design Document

## Overview

The client UX redesign reshapes four existing pages (`src/pages/client/{home,journey,tasks,documents}`) and adds an Ask Pylott panel. It is primarily a presentation-layer effort built on data and components that already exist. This document maps each screen to its data sources, components, and the specific new work required.

## Shared foundations (reuse, don't rebuild)

- **Components:** `Badge` (status pills), `Modal`, `Toast`, `Button`, form primitives, `DragNdrop`.
- **Status colour mapping (existing Badge variants):** Valid/Completed → `success`/`completed` (green); Expiring soon / due → `due` (amber); Missing / overdue → `destructive`/`late` (red); In progress → `in_progress`; Pending → `pending`.
- **Task display:** `getDisplayedStatus` / `getDisplayedStatusBadgeVariant` (already compute Pending/In Progress/Completed/Overdue).
- **Document expiry:** `getDocumentExpiryInfo`, `getExpiryBadgeVariant`, `getExpiryBadgeLabel` (already produce Valid / Does not expire / Expiring soon states).

## Screen designs

### 1. Home (`src/pages/client/home`)
- **Layout:** greeting → 3 KPI cards → two panels ("Needs your attention", "Next milestone" with progress bar).
- **Data:** task counts (`use-get-project-task-counts`), documents (visible-to-client), milestones.
- **New work:** a `getProjectProgress(project)` helper computing % complete and an estimated completion date. Define the formula first (see open question). Keep it a pure, testable util (mirrors `task-display-status.ts`).
- **Attention list:** reuse the task/document status to list outstanding items with a colour dot.

### 2. Journey (`src/pages/client/journey`)
- **Layout:** horizontal stepper (completed ✓ / current ◉ / upcoming ○) with per-stage name + `start → est. end` dates, then a "Current stage" card with outstanding actions.
- **Data:** milestones carry `estimated_start_date`, `estimated_end_date`, `milestone_start_date`, `milestone_status` — map these to the stepper. Current stage = the milestone whose status is active/in-progress.
- **New work:** mostly layout. Add graceful handling where a stage has no dates.

### 3. Tasks (`src/pages/client/tasks`)
- **Layout:** status columns (Needs action / In progress / Completed), each a list of compact task cards (name + short action description).
- **Data:** existing client tasks + `getDisplayedStatus`; clicking a card routes to the existing client task-action view (`client-task-view.tsx`) — the "straight to the action" behaviour already exists.
- **New work:** group tasks by status into columns; colour-coded labels; **mobile fallback** — stack columns vertically or use a status tab switcher below a breakpoint.
- **Relationship to earlier scroll issue:** this board replaces the long vertical stack of full-height cards the user flagged.

### 4. Documents (`src/pages/client/documents`)
- **Layout:** table — Document | Status | Expiry, with a short description line under/near the name.
- **Data:** documents + the expiry utilities above; `description` field already exists.
- **New work:** render the `description` as instruction text; map the four status states to Badge variants; "Missing" is derived from a required-but-not-uploaded document (ties into `requires_expiry` / document-type config).

### 5. Ask Pylott
- **Now:** a contained panel (prompt input + message area) as a **visual placeholder**, clearly non-functional, so it doesn't imply a shipped capability.
- **Later (separate spec):** functional AI requires per-client context assembly (tasks/documents/journey as structured data), retrieval, a model integration, cost controls, and a resolved client-PII handling boundary. Per the AI-readiness discussion, the chat UI is the small part; the data/compliance plumbing is the major work. Do NOT ship fake answers in production.

## Data Models

No schema changes required for Home/Journey/Tasks/Documents — the needed fields exist. The only derivations are the project progress %/completion (computed, not stored). Ask Pylott's functional version is out of scope here and will define its own data/context model.

## Testing Strategy

- Pure utils (project progress, any status mapping) get unit/property tests like the existing `task-display-status` tests.
- Each page: verify loading, empty, and error states, and responsive behaviour at a mobile breakpoint.
- Documents: verify each status (Valid / Does not expire / Expiring soon / Missing) renders the correct label/colour.
- Tasks: verify grouping into the correct columns and that clicking routes to the action view.

## Rollout

Ship page-by-page behind the existing client routes. Order by value/readiness:
1. Documents (highest readiness — surface description + status pills)
2. Tasks board (reuses status + action routing; add mobile fallback)
3. Home (needs the progress calc)
4. Journey (verify milestone dates populate for live projects)
5. Ask Pylott — visual placeholder now; functional version as its own gated spec
