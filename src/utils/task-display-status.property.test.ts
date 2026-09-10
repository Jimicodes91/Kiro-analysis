import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { getDisplayedStatus, isOverdue } from './task-display-status';

/**
 * Property-based tests for the pure functions in task-display-status.ts.
 *
 * Feature: client-documents-tasks
 * Uses fast-check + vitest, minimum 100 iterations per property.
 */

// A fixed "now" reference so day-granularity comparisons are deterministic.
const NOW = new Date('2024-06-15T12:00:00.000Z');
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Statuses to exercise: the domain statuses plus arbitrary noise.
const statusArb = fc.oneof(
  fc.constantFrom('pending', 'in_progress', 'completed', 'sent', 'draft'),
  fc.string()
);

/**
 * Due-date arbitrary spanning the past, today, and the future — including
 * dates on the exact day boundary — plus `undefined` and `null` to cover the
 * "no due date" branches.
 */
const dueDateArb = fc.oneof(
  // Offsets in days relative to NOW, spanning clearly past → clearly future,
  // including the same day (0).
  fc
    .integer({ min: -10, max: 10 })
    .map(
      (offsetDays) =>
        new Date(NOW.getTime() + offsetDays * MS_PER_DAY).toISOString() as
          | string
          | null
          | undefined
    ),
  fc.constant(undefined as string | null | undefined),
  fc.constant(null as string | null | undefined)
);

/**
 * Reference implementation of the day-granularity comparison used by the
 * function under test. Returns true iff `now` (truncated to the start of its
 * day) is strictly after `due` (truncated to the start of its day).
 */
function isStrictlyPastByDay(dueDate: string, now: Date): boolean {
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return false;

  const nowDay = new Date(now);
  nowDay.setHours(0, 0, 0, 0);
  const dueDay = new Date(due);
  dueDay.setHours(0, 0, 0, 0);

  return nowDay.getTime() > dueDay.getTime();
}

describe('task-display-status property tests', () => {
  // Feature: client-documents-tasks, Property 1
  it('Property 1: Overdue computation — isOverdue iff due date exists, now strictly past it (by day), and status !== "completed"', () => {
    fc.assert(
      fc.property(statusArb, dueDateArb, (status, dueDate) => {
        const actual = isOverdue(status, dueDate, NOW);

        const hasValidDueDate =
          dueDate != null && !isNaN(new Date(dueDate).getTime());
        const expected =
          hasValidDueDate &&
          status !== 'completed' &&
          isStrictlyPastByDay(dueDate as string, NOW);

        expect(actual).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: client-documents-tasks, Property 2
  it('Property 2: Displayed status mapping — completed → "Completed"; else overdue → "Overdue"; else in_progress → "In Progress"; else "Pending"', () => {
    fc.assert(
      fc.property(statusArb, dueDateArb, (status, dueDate) => {
        const actual = getDisplayedStatus(status, dueDate, NOW);

        // Cross-check precedence against isOverdue itself.
        let expected: string;
        if (status === 'completed') {
          expected = 'Completed';
        } else if (isOverdue(status, dueDate, NOW)) {
          expected = 'Overdue';
        } else if (status === 'in_progress') {
          expected = 'In Progress';
        } else {
          expected = 'Pending';
        }

        expect(actual).toBe(expected);

        // "Completed" must win regardless of due date.
        if (status === 'completed') {
          expect(actual).toBe('Completed');
        }
      }),
      { numRuns: 100 }
    );
  });
});
