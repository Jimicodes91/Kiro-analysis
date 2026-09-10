import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { isExpiryRequired } from "./document-expiry";

// Feature: client-documents-tasks, Property 3
//
// Property 3: Expiry-required decision
// Validates: Requirements 2.1, 2.2, 2.3, 2.4
//
// isExpiryRequired must return true if and only if the selected document type
// requires an expiry date (requires_expiry === true) AND the document is not
// marked as non-expiring (doesNotExpire !== true). Otherwise it returns false.
describe("isExpiryRequired — Property 3: Expiry-required decision", () => {
  // Arbitrary requires_expiry value: true, false, or undefined.
  const requiresExpiryArb = fc.constantFrom<boolean | undefined>(
    true,
    false,
    undefined
  );

  // Arbitrary documentType: either null/undefined, or an object wrapping a
  // requires_expiry value (true/false/undefined).
  const documentTypeArb = fc.oneof(
    fc.constant<null | undefined>(null),
    fc.constant<null | undefined>(undefined),
    requiresExpiryArb.map((requires_expiry) => ({ requires_expiry }))
  );

  // Arbitrary doesNotExpire value: true, false, or undefined.
  const doesNotExpireArb = fc.constantFrom<boolean | undefined>(
    true,
    false,
    undefined
  );

  it("returns true iff requires_expiry === true AND doesNotExpire !== true", () => {
    fc.assert(
      fc.property(documentTypeArb, doesNotExpireArb, (documentType, doesNotExpire) => {
        const expected =
          documentType?.requires_expiry === true && doesNotExpire !== true;

        expect(isExpiryRequired(documentType, doesNotExpire)).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });
});
