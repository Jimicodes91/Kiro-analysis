// Feature: client-documents-tasks, Property 4: Action-UI resolution totality
//
// For any string value of `task_category_type` and any task status, the client
// action-UI resolver returns a defined action-UI kind: each recognized type
// maps to its designated UI, any unrecognized type maps to the general-
// completion UI, and a `"completed"` status resolves to the completed state
// with no upload affordance presented.
//
// **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 6.4**

import fc from "fast-check";
import { describe, expect, test } from "vitest";
import {
    ActionUiKind,
    hasUploadAffordance,
    resolveActionUiKind,
} from "./action-ui";

// The recognized client task category types (allowed set).
const ALLOWED_CATEGORY_TYPES = [
  "signing",
  "information_request",
  "document_upload",
  "task",
  "complete_form",
] as const;

// The defined set of action-UI kinds the resolver may return.
const VALID_KINDS: ReadonlySet<ActionUiKind> = new Set<ActionUiKind>([
  "document_upload",
  "signing",
  "information_request",
  "complete_form",
  "general",
  "completed",
]);

// The category types that map to a dedicated (non-general) action UI.
const RECOGNIZED_TYPES: ReadonlySet<string> = new Set([
  "document_upload",
  "signing",
  "information_request",
  "complete_form",
]);

const RUNS = { numRuns: 100 };

// Category-type generator: allowed set + arbitrary unknown strings + undefined.
const categoryTypeArb: fc.Arbitrary<string | undefined> = fc.oneof(
  fc.constantFrom(...ALLOWED_CATEGORY_TYPES),
  fc.string(),
  fc.constant(undefined)
);

// Status generator: lifecycle statuses + arbitrary unknown strings.
const statusArb: fc.Arbitrary<string> = fc.oneof(
  fc.constantFrom("pending", "in_progress", "sent", "draft", "completed"),
  fc.string()
);

describe("resolveActionUiKind — Property 4: Action-UI resolution totality", () => {
  test("always returns a defined action-UI kind (totality)", () => {
    fc.assert(
      fc.property(categoryTypeArb, statusArb, (categoryType, status) => {
        const kind = resolveActionUiKind(categoryType, status);
        expect(kind).toBeDefined();
        expect(kind).not.toBeNull();
        expect(VALID_KINDS.has(kind)).toBe(true);
      }),
      RUNS
    );
  });

  test("unknown/unrecognized types (non-completed status) map to the general completion UI", () => {
    // Constrain to non-completed statuses so the type-based fallback is exercised.
    const nonCompletedStatus = statusArb.filter((s) => s !== "completed");
    fc.assert(
      fc.property(categoryTypeArb, nonCompletedStatus, (categoryType, status) => {
        const kind = resolveActionUiKind(categoryType, status);
        const isRecognized =
          categoryType !== undefined && RECOGNIZED_TYPES.has(categoryType);
        if (!isRecognized) {
          // `task`, undefined, and any random unknown string → general.
          expect(kind).toBe("general");
        } else {
          // Recognized types map to their own designated kind.
          expect(kind).toBe(categoryType);
        }
      }),
      RUNS
    );
  });

  test("completed status resolves to the completed state with no upload affordance", () => {
    fc.assert(
      fc.property(categoryTypeArb, (categoryType) => {
        const kind = resolveActionUiKind(categoryType, "completed");
        // Regardless of category type, a completed task shows the completed state.
        expect(kind).toBe("completed");
        // And presents no upload affordance (Req 6.4).
        expect(hasUploadAffordance(kind)).toBe(false);
      }),
      RUNS
    );
  });

  test("only the document_upload kind exposes an upload affordance", () => {
    fc.assert(
      fc.property(categoryTypeArb, statusArb, (categoryType, status) => {
        const kind = resolveActionUiKind(categoryType, status);
        expect(hasUploadAffordance(kind)).toBe(kind === "document_upload");
      }),
      RUNS
    );
  });
});
