# Design Document

## Overview

Restore the `tsc -b` Type_Gate to green in three tiers. Tier 1 (dependency install) is already merged. This design covers Tier 2 (application-code errors) and Tier 3 (test-file policy), then enforcement. The guiding principle: **make types honest without suppressing them**, and isolate the one cross-cutting change (query-hook typing) so its ripple is contained and reviewable.

## Why the app still runs while the gate is red

`vite build` uses esbuild, which strips TypeScript types without checking them. `tsc -b` is a separate correctness gate bolted onto the build script and pre-commit hook. The two are independent: a red `tsc` does not affect the shipped bundle. This is why 642 errors accumulated unnoticed at runtime.

## Tier 2 — Application code

### 2a. Query-hook typing + call-site correction (Requirement 1)

**Root cause:** `useQueryActionHook<T>` returns `{ ...queryResult, value: queryResult.data?.data }`. Because `PylottResponseType<D>` wraps `D & { message }`, `value` is already the unwrapped data (`D & { message }`). Consumers, however, call the hook **without** a generic and read `.value.data` — a Double_Unwrap that only type-checks because `value` is `unknown`.

**Measured scope:** ~180 `.value.data` sites across 73 files.

**Approach:**
1. Type the wrapper hooks at their call sites (e.g. `useGetTaskDetails` → `useCustomQuery<TaskDetails>`), so `value` becomes the concrete data shape.
2. Correct every consumer from `.value.data` to `.value`.
3. Verify each affected screen renders unchanged.

**Critical caveat:** typing a hook flips its consumers from silently-passing to type-checked in one step, so **the total error count will temporarily increase** (observed: 229 → 233 when one hook was typed in isolation). This is expected and is why the work must be done hook-by-hook (or in one deliberate sweep) with the call sites fixed in the same PR — never landing a typed hook without fixing its consumers. No `as any`.

**Sequencing within 2a:** start with the highest-traffic hooks (task details, project tasks, lists), fixing their call sites, and re-measure after each so the count trends down monotonically by the end of the PR.

### 2b. Missing type fields (Requirement 2)

Targeted, one type at a time: add the field the code reads (e.g. `User.workspace_id`, `Contact` status, reconcile `EventTypeDetails`/`DocumentTypeDetails`) **after confirming the API returns it**. Low ripple; each is isolated to a type definition and its direct consumers.

### 2c. Form/modal reconciliation (Requirement 3)

`edit-project-task-modal.tsx` (20), `edit-task-modal.tsx` (20), `add-task-modal.tsx` (8) carry react-hook-form + zod/yup generic-inference mismatches (TS2322/TS2769/TS2719 cluster). Resolve by aligning the resolver/schema types with the form value types. No behavior change; verify the forms still submit.

### 2d. Unused declarations (Requirement 4)

Delete TS6133 occurrences. Trivial.

## Tier 3 — Test-file policy (Requirement 5)

156 errors live in `*.test.tsx` / `*.property.test.tsx` / `*.bugcondition*` files. Options:

- **Exclude tests from the gate (recommended):** add test globs to the build tsconfig `exclude` (or a dedicated `tsconfig.build.json` used by `tsc -b`). Tests still type-check-run under Vitest. Makes the gate reflect shipped code.
- **Bring tests to type-clean:** larger effort, lower value.

Separately, the `*.bugcondition*` tests are **intentionally failing** (they assert known bugs). Decide: keep as living bug documentation, fix the underlying bugs, or quarantine.

## Enforcement (Requirement 6)

Once in-scope errors reach zero, wire `tsc -b` (or `tsc --noEmit`) as a required CI check and stop routine `--no-verify`. This is a workflow change — communicate it so new type errors blocking commits is understood as intended.

## Risk Notes

- The single biggest risk is 2a done carelessly: a blanket typing without fixing call sites, or `as any` suppression, would either break the build worse or hide the Double_Unwrap bug. Keep it isolated and reviewed.
- 2b can ripple if a shared type (e.g. `User`) gains a field consumed in many places — re-measure after each.
- Tier 3 exclusion reduces type coverage of tests; acceptable if Vitest remains the test correctness gate, but it is a team decision.

## Testing Strategy

- After 2a: manually exercise the highest-traffic screens (task detail, task list, project details, dashboard) to confirm data still renders.
- After 2b/2c: exercise the specific screens whose types changed (contacts, event/task modals).
- Full `tsc -b` after each PR to confirm the count trends to zero and never regresses.
