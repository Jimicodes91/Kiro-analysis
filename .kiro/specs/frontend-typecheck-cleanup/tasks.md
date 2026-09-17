# Implementation Plan: Frontend Type-Check Cleanup

Restore the `tsc -b` gate to green without runtime regressions, then enforce it.
Progress: **642 → 156 errors**, and **all remaining 156 are in test files** — application code type-checks clean.

## Tasks

- [x] 0. Tier 1 — install missing test dev-dependencies
  - `@fast-check/vitest`, `@testing-library/user-event`; dropped 642 → 229, no app code changed. _Merged to `v1`._

### Tier 2 — Application code — DONE (merged to `v1`)

Tier 2 turned out smaller/different than estimated. The feared "~180 `.value.data` across 73 files" rewrite was unnecessary (those accesses were already correct against the response wrappers), and the react-hook-form `Control` (TS2719) cluster was **not** a version-bump problem — those errors lived in the task-modal files and cleared as a side effect of fixing the forms. Each fix was investigated; several were **real runtime bugs**, not strictness.

- [x] 1. Query-hook typing / `.value.data` reads
  - Typed `useGetTaskDetails` with a proper response wrapper. Fixed the signup OTP token read (`response.data.data` → `response.data`, was `undefined`) and the contact-invite response reads (`response.invite` → `response.data.invite`, toasts never fired).
- [x] 2. Missing type fields / imports
  - `api.service` `UserType` import; `ApiResponse` envelope defined (corrected to `status`); Badge-variant typing on `getComputedProjectStatus`; `ContactData.contacts` → `Contact[]`; `event-type` row/modal entity type; `contact-modal-form` accepts `Contact`.
- [x] 3. Task form/modal fixes (real save bugs)
  - All three task modals moved to the backend's single `due_date` model (they were sending dropped `start_date`/`end_date`), `in_progress` status allowed, and the required `visibility` field set — these caused task **create/edit to silently fail to save**. Also added success/error/`onInvalid` toasts.
- [x] 4. Misc: Forms tab import (broken render), create-event datetime guard, unused-var removals.
- [x] 5. Checkpoint — `tsc -b` reports **0 non-test errors**. Verified.

### Tier 3 — Test-file policy (team decision) — REMAINING

All 156 remaining errors are in test files (mock-data shape mismatches TS2741/TS2352/TS2353, test-runner globals TS2582 "Cannot find name 'it'", possibly-null TS18047, unused TS6133).

- [ ] 6. Decide and apply the test-file gate policy — **[POLICY]**
  - Recommended: exclude test globs from the `tsc -b` gate (dedicated `tsconfig.build.json` or `exclude`); tests still run under Vitest.
  - _Requirements: 5.1_
- [ ] 7. Triage the intentionally-failing `*.bugcondition*` tests
  - Keep as bug documentation, fix the underlying bugs, or quarantine.
  - _Requirements: 5.2_

### Enforcement — REMAINING

- [ ] 8. Make `tsc -b` an enforced CI check and stop routine `--no-verify`
  - Achievable once the Tier 3 test-file policy is applied (app code is already clean).
  - _Requirements: 6.1_

## Notes

- Application code is type-clean; the gate is red only because of test files. Tier 3 is the last thing between here and a green, enforceable gate.
- Behavioral fixes shipped during Tier 2 (task save, signup OTP, Forms tab, contact toasts) build and type-check, but warrant a staging smoke test since they change runtime behavior.
- Repo friction observed throughout: the editor's auto-format-on-save repeatedly pruned in-use imports mid-edit (~9 files). Worth fixing the organize-imports config.
