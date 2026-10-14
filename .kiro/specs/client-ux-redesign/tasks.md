# Implementation Plan: Client UX Redesign

Reshape the four existing client pages per the UI/UX reference guide and add an Ask Pylott placeholder. Mostly presentation-layer work on existing data/components. Ship page-by-page, ordered by readiness. Each page gets consistent loading/empty/error + responsive states.

## Tasks

### Documents (highest readiness — do first)

- [ ] 1. Redesign the client Documents page as a scannable table
  - Columns: Document, Status, Expiry
  - Map status to Badge variants: Valid → success, Does not expire → neutral, Expiring soon → due (amber), Missing → destructive (red), using the existing expiry utilities
  - Surface the existing `description` field as instruction text per document
  - Derive "Missing" for required-but-not-uploaded documents
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.1_

### Tasks board

- [ ] 2. Group the client Tasks page into status columns (Needs action / In progress / Completed)
  - Reuse `getDisplayedStatus` + Badge variants for colour-coded labels
  - Each card: name + short action description; click routes to the existing client task-action view
  - _Requirements: 3.1, 3.2, 3.3, 3.4_
- [ ] 3. Add a mobile fallback for the Kanban columns (stacked or status-tab switcher below a breakpoint)
  - _Requirements: 3.5, 6.4_

### Home

- [ ] 4. Add a pure `getProjectProgress` util (% complete + estimated completion)
  - Define the formula first (completed milestones/tasks ratio); unit/property tests like `task-display-status`
  - Degrade gracefully when not derivable
  - _Requirements: 1.3, 1.4_
- [ ] 5. Redesign the client Home page
  - Greeting + 3 KPI cards (tasks to complete, documents needed, project progress %)
  - "Needs your attention" list with colour status dots; "Next milestone" card + progress bar
  - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.2_

### Journey

- [ ] 6. Confirm milestone dates populate for live projects
  - Verify `estimated_start_date` / `estimated_end_date` are set on real project milestones (not just templates)
  - _Requirements: 2.2_
- [ ] 7. Redesign the client Journey page as a horizontal timeline
  - Completed/current/upcoming states; per-stage start → est. end dates; current-stage card with outstanding actions; graceful handling of missing dates
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

### Ask Pylott

- [ ] 8. Build the Ask Pylott panel as a visual placeholder
  - Contained assistant layout (prompt input + message area); clearly non-functional; no fake answers shipped as real
  - _Requirements: 5.1, 5.2, 5.4_
- [ ]* 9. (Separate spec) Functional Ask Pylott
  - Define context assembly, retrieval, model integration, cost controls, and client-PII handling before building. Gated on the AI-readiness decisions.
  - _Requirements: 5.3_

### Cross-cutting

- [ ] 10. Consistency pass: loading/empty/error states + responsive behaviour across all four pages
  - _Requirements: 6.3, 6.4_
- [ ]* 11. (Optional) Accessibility pass — keyboard nav, focus management in modals, contrast
  - _Requirements: (open question — target WCAG level)_

## Notes

- No schema changes for Home/Journey/Tasks/Documents — needed fields exist.
- The Tasks board replaces the long vertical card scroll flagged in client review.
- **Biggest flags for the team:** (a) define the project-progress formula; (b) confirm milestone dates on live projects; (c) decide if/under-what-constraints Ask Pylott becomes functional (the "major work" is the data/PII plumbing, not the chat UI).
- Reuse existing components and status/colour conventions throughout.
