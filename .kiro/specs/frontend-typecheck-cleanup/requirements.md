# Requirements Document

## Introduction

The frontend build command `npm run build` runs `tsc -b && vite build`. The `tsc -b` type-check gate is currently **red**, so a normal commit is blocked by the pre-commit hook and contributors bypass it with `--no-verify`. The shipped app is unaffected because Vite/esbuild transpiles without type-checking — only the type gate is broken. This feature restores the type gate to green **without introducing runtime regressions**, then makes it enforceable.

Work is organized into three tiers by cost, risk, and value.

## Current State (measured)

- **Tier 1 — DONE (merged to `v1`):** installed missing test dev-dependencies (`@fast-check/vitest`, `@testing-library/user-event`). Error count dropped **642 → 229** with no application code changed.
- Remaining **229** errors: **156 in test files**, **73 in application code**.
- Application-code error codes: TS2322 (26), TS2339 (14), TS2769 (8), TS2719 (8), TS2345 (6), TS6133 (5), TS2741 (2), plus a few singletons.
- **180 `.value.data` call sites across 73 files** currently pass only because the query hooks' `value` is untyped; typing the hooks will surface these.

## Glossary

- **Type_Gate**: the `tsc -b` step in `npm run build` and the pre-commit hook.
- **Query_Hook**: `useQueryActionHook` / `useCustomQuery` (`src/hooks/use-queryaction.tsx`) whose returned `value` is the already-unwrapped response data.
- **Double_Unwrap**: a call site reading `.value.data` when `.value` is already the data.
- **Bug_Condition_Test**: a test authored to assert a known bug exists (files named `*.bugcondition*`); intentionally failing.

## Requirements

### Requirement 1: Query-hook typing and call-site correction — [HIGH VALUE / HIGH RIPPLE]

**User Story:** As a developer, I want query hooks to be generically typed and their consumers to read the data correctly, so that response shapes are type-checked and the Double_Unwrap bug is removed.

#### Acceptance Criteria

1. WHEN a Query_Hook is given a generic type argument, THE returned `value` SHALL be typed as that response data shape.
2. WHERE a call site currently uses Double_Unwrap (`.value.data`), THE call site SHALL be corrected to `.value`.
3. THE correction SHALL NOT use `as any` to suppress the resulting type errors.
4. WHEN the affected screens are exercised, THEY SHALL render the same data as before (no runtime regression).

### Requirement 2: Missing type fields — [LOW RIPPLE / TARGETED]

**User Story:** As a developer, I want types to include the fields the code actually reads, so that legitimate property access type-checks.

#### Acceptance Criteria

1. WHERE application code reads a field absent from a type (e.g. `User.workspace_id`), THE type SHALL be extended to include it, AFTER confirming the API returns that field.
2. THE change SHALL be scoped per type/file to keep ripple low.

### Requirement 3: Form/modal type reconciliation — [LOW VALUE / FIDDLY]

**User Story:** As a developer, I want the task/event/contact form modals to type-check, so the Type_Gate is not blocked by react-hook-form/zod inference mismatches.

#### Acceptance Criteria

1. THE form/modal type mismatches (concentrated in `edit-project-task-modal.tsx`, `edit-task-modal.tsx`, `add-task-modal.tsx`) SHALL be resolved without changing form behavior.

### Requirement 4: Remove unused declarations — [TRIVIAL]

#### Acceptance Criteria

1. TS6133 "declared but never read" occurrences SHALL be removed.

### Requirement 5: Test-file gate policy — [POLICY / TIER 3]

**User Story:** As a team, we want the Type_Gate to reflect shipped code, so that test-file strictness does not block commits.

#### Acceptance Criteria

1. THE team SHALL decide whether test files are excluded from the Type_Gate (still run under Vitest) or brought to type-clean.
2. WHERE Bug_Condition_Tests are intentionally failing, THE team SHALL decide to keep, fix the underlying bug, or quarantine them.

### Requirement 6: Enforce the gate — [FINAL]

#### Acceptance Criteria

1. WHEN the error count reaches zero for in-scope code, THE Type_Gate SHALL be enforced in CI and the pre-commit hook SHALL no longer be routinely bypassed.

## Cost / Risk Summary

| Requirement | Value | Ripple / Risk |
|---|---|---|
| 1. Query-hook typing + call sites | High | High — ~180 sites; count rises before it falls |
| 2. Missing type fields | Medium | Low |
| 3. Form/modal reconciliation | Low | Low |
| 4. Unused declarations | Low | None |
| 5. Test-file policy | Medium | None (policy) |
| 6. Enforce gate | High | Medium (workflow change) |

## Open Questions

- Confirm each missing field (Req 2) is actually returned by the API before adding it to a type.
- Tier 3: exclude test files from the gate, or invest in making them type-clean?
- What do the intentionally-failing Bug_Condition_Tests document, and are those bugs still open?
