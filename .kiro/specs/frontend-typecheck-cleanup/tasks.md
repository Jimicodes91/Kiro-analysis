# Implementation Plan: Frontend Type-Check Cleanup

Restore the `tsc -b` gate to green without runtime regressions, then enforce it. Do the work on a dedicated branch, in small PRs, re-measuring after each so the error count trends down. Baseline after Tier 1 (already merged): **229 errors** (156 test, 73 app).

## Tasks

- [x] 0. Tier 1 — install missing test dev-dependencies
  - `@fast-check/vitest`, `@testing-library/user-event`; dropped 642 → 229, no app code changed
  - _Merged to `v1`._

### Tier 2 — Application code (dedicated branch)

- [ ] 1. Type the query hooks and fix `.value.data` → `.value` call sites — **[HIGH VALUE / HIGH RIPPLE]**
  - Add generics to the wrapper query hooks (start with `useGetTaskDetails`, project-task/list hooks)
  - Correct all ~180 `.value.data` call sites across 73 files to `.value`
  - Do NOT use `as any`; fix hooks and their consumers in the same PR
  - Re-measure after each hook so the count trends down monotonically by PR end
  - Manually verify task detail, task list, project details, dashboard still render
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Add missing type fields — **[LOW RIPPLE]**
  - Per type, after confirming the API returns the field: e.g. `User.workspace_id`, `Contact`/`ContactDetails` reconciliation, `EventTypeDetails` vs `DocumentTypeDetails`
  - _Requirements: 2.1, 2.2_

- [ ] 3. Reconcile form/modal types — **[LOW VALUE / FIDDLY]**
  - Align RHF resolver/schema types in `edit-project-task-modal.tsx`, `edit-task-modal.tsx`, `add-task-modal.tsx`
  - Verify forms still submit
  - _Requirements: 3.1_

- [ ] 4. Remove unused declarations (TS6133) — **[TRIVIAL]**
  - _Requirements: 4.1_

- [ ] 5. Checkpoint — app-code errors at zero
  - `tsc -b` reports no errors outside test files

### Tier 3 — Test-file policy (team decision)

- [ ] 6. Decide and apply the test-file gate policy — **[POLICY]**
  - Recommended: exclude test globs from the `tsc -b` gate (dedicated `tsconfig.build.json` or `exclude`); tests still run under Vitest
  - _Requirements: 5.1_

- [ ] 7. Triage the intentionally-failing `*.bugcondition*` tests
  - Keep as bug documentation, fix the underlying bugs, or quarantine
  - _Requirements: 5.2_

### Enforcement

- [ ] 8. Make `tsc -b` an enforced CI check and stop routine `--no-verify`
  - Only after in-scope errors reach zero; communicate the workflow change
  - _Requirements: 6.1_

## Notes

- Task 1 is the large, risky one — size it as its own ticket. Expect the error count to rise before it falls while typing hooks; that is normal and must be resolved within the same PR by fixing call sites.
- Tasks 2–4 are independent, low-risk follow-ups suitable for small PRs.
- Tier 3 is a policy call, not code risk.
- Enforcement (task 8) is last so the gate is only turned on once it can pass.
