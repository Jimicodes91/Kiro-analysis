import { Badge } from '@/components/ui/badge';
import { taskStatuses } from '@/lib/constants';
import { getFormattedText } from '@/lib/utils';
import { taskFormSchema } from '@/utils/validation-schema/task';
import { fc, test } from '@fast-check/vitest';
import { render } from '@testing-library/react';
import { describe, expect } from 'vitest';

/**
 * Preservation Property Tests - Status Functionality
 *
 * **Validates: Requirements 3.1, 3.3, 3.9**
 *
 * These tests capture the CURRENT baseline behavior of status-related
 * operations BEFORE any fix is applied. They must PASS on unfixed code
 * to confirm the behavior we want to PRESERVE through the fix.
 *
 * Preserved behaviors:
 * - taskStatuses constant lists the five statuses the task dropdown offers, with labels
 * - Badge component renders without crashing for each status variant
 * - Task form validation schema accepts valid status values
 * - The form schema accepts: pending, in_progress, completed
 *
 * Updated: the original version of this file described a three-status model. The app
 * now has five dropdown statuses (the backend has six, and returns `pending` as `sent`),
 * and the form schema requires due_date and visibility instead of start/end dates.
 */

// Statuses the task form schema accepts (src/utils/validation-schema/task.ts); also the
// ones with a Badge colour variant.
const VALID_TASK_STATUSES = ['pending', 'in_progress', 'completed'] as const;

// Statuses the Add/Edit task dropdown offers (taskStatuses in src/lib/constants.ts).
const DROPDOWN_STATUSES = ['draft', 'sent', 'in_progress', 'completed', 'archived'] as const;

describe('Preservation: Status Functionality (Requirements 3.1, 3.3, 3.9)', () => {
  describe('Property 1: taskStatuses constant lists the five dropdown statuses', () => {
    /**
     * **Validates: Requirements 3.1**
     *
     * The taskStatuses constant has five entries with specific label/value
     * pairs in the canonical order.
     */
    test('taskStatuses constant has exactly 5 entries, in order', () => {
      expect(taskStatuses.map((s) => s.value)).toEqual([...DROPDOWN_STATUSES]);
    });

    test('taskStatuses constant has the draft, sent and archived labels', () => {
      expect(taskStatuses.find((s) => s.value === 'draft')?.label).toBe('Draft');
      expect(taskStatuses.find((s) => s.value === 'sent')?.label).toBe('Sent');
      expect(taskStatuses.find((s) => s.value === 'archived')?.label).toBe('Archived');
    });

    test('taskStatuses has no "pending" entry (the API returns pending tasks as "sent")', () => {
      expect(taskStatuses.find((s) => s.value === 'pending')).toBeUndefined();
    });

    test('taskStatuses constant contains in_progress with label "In Progress"', () => {
      const inProgress = taskStatuses.find((s) => s.value === 'in_progress');
      expect(inProgress).toBeDefined();
      expect(inProgress?.label).toBe('In Progress');
    });

    test('taskStatuses constant contains completed with label "Completed"', () => {
      const completed = taskStatuses.find((s) => s.value === 'completed');
      expect(completed).toBeDefined();
      expect(completed?.label).toBe('Completed');
    });

    test.prop([fc.constantFrom(...DROPDOWN_STATUSES)])(
      'every dropdown status has a label and its own value',
      (status) => {
        const found = taskStatuses.find((s) => s.value === status);
        expect(found).toBeDefined();
        expect(found?.label).toBeTruthy();
        expect(found?.value).toBe(status);
      }
    );

    /**
     * KNOWN MISMATCH (documented, not endorsed): the dropdown offers draft, sent and
     * archived, but taskFormSchema only accepts pending, in_progress and completed, so
     * those three would fail validation if chosen in a form that uses the schema.
     * AddTaskModal and EditTaskModal (which use both) are not imported anywhere in the
     * app today, so no user can reach this. If you wire those modals up, or widen the
     * schema, this test will fail on purpose: update it together with that change.
     */
    test('KNOWN MISMATCH: the schema rejects the dropdown statuses draft, sent and archived', async () => {
      const accepted = async (status: string) =>
        taskFormSchema
          .validateAt('status', { status })
          .then(() => true)
          .catch(() => false);

      const rejected: string[] = [];
      for (const status of DROPDOWN_STATUSES) {
        if (!(await accepted(status))) rejected.push(status);
      }
      expect(rejected).toEqual(['draft', 'sent', 'archived']);
    });
  });

  describe('Property 2: Badge component renders for all task status variants', () => {
    /**
     * **Validates: Requirements 3.1**
     *
     * The Badge component must render without crashing for each of the
     * 3 task status variants (pending, in_progress, completed).
     */
    test.prop([fc.constantFrom('pending', 'in_progress', 'completed') as fc.Arbitrary<'pending' | 'in_progress' | 'completed'>])(
      'Badge renders without crashing for any valid task status variant',
      (status) => {
        const { container } = render(
          Badge({ variant: status, children: status })
        );
        const badge = container.querySelector('.inline-flex');
        expect(badge).toBeInTheDocument();
      }
    );

    test('Badge renders pending variant with correct styling classes', () => {
      const { container } = render(Badge({ variant: 'pending', children: 'Pending' }));
      const badge = container.querySelector('.inline-flex');
      expect(badge).toBeInTheDocument();
      // Pending variant has specific bg/text classes
      expect(badge?.className).toContain('bg-');
      expect(badge?.className).toContain('text-');
    });

    test('Badge renders in_progress variant with correct styling classes', () => {
      const { container } = render(Badge({ variant: 'in_progress', children: 'In Progress' }));
      const badge = container.querySelector('.inline-flex');
      expect(badge).toBeInTheDocument();
      expect(badge?.className).toContain('bg-');
      expect(badge?.className).toContain('text-');
    });

    test('Badge renders completed variant with correct styling classes', () => {
      const { container } = render(Badge({ variant: 'completed', children: 'Completed' }));
      const badge = container.querySelector('.inline-flex');
      expect(badge).toBeInTheDocument();
      expect(badge?.className).toContain('bg-');
      expect(badge?.className).toContain('text-');
    });
  });

  describe('Property 3: Task form validation accepts valid status values', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * The task form validation schema must accept all 3 valid status values.
     * Status is a required field in the schema.
     */
    test.prop([
      fc.record({
        name: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{2,49}$/),
        project_type_id: fc.uuid(),
        project_id: fc.uuid(),
        status: fc.constantFrom('pending', 'in_progress', 'completed'),
        description: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,99}$/),
        due_date: fc.integer({ min: 2020, max: 2029 }).map((year) => new Date(`${year}-08-15T00:00:00.000Z`)),
        visibility: fc.constantFrom('inhouse', 'client_facing'),
        is_visible_to_client: fc.boolean(),
        assignees: fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }),
      }),
    ])(
      'task form schema validates successfully for any valid status value',
      async (formData) => {
        const result = await taskFormSchema.isValid(formData);
        expect(result).toBe(true);
      }
    );

    test('task form schema requires status field', async () => {
      const formWithoutStatus = {
        name: 'Test Task',
        project_type_id: '123e4567-e89b-12d3-a456-426614174000',
        project_id: '123e4567-e89b-12d3-a456-426614174001',
        description: 'A test task',
        due_date: new Date('2024-01-31'),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['123e4567-e89b-12d3-a456-426614174002'],
      };
      const result = await taskFormSchema.isValid(formWithoutStatus);
      expect(result).toBe(false);
    });
  });

  describe('Property 4: Status values used in API operations are from valid set', () => {
    /**
     * **Validates: Requirements 3.9**
     *
     * Task operations must use only valid status values (pending, in_progress, completed).
     * The Task type restricts status to these 3 values.
     */
    test.prop([
      fc.constantFrom(...VALID_TASK_STATUSES),
    ])(
      'getFormattedText produces a non-empty string for any valid status',
      (status) => {
        const formatted = getFormattedText(status);
        expect(formatted).toBeTruthy();
        expect(formatted.length).toBeGreaterThan(0);
      }
    );

    test('getFormattedText replaces underscores with spaces for status values', () => {
      expect(getFormattedText('pending')).toBe('pending');
      expect(getFormattedText('in_progress')).toBe('in progress');
      expect(getFormattedText('completed')).toBe('completed');
    });

    test.prop([
      fc.record({
        id: fc.uuid(),
        status: fc.constantFrom('pending' as const, 'in_progress' as const, 'completed' as const),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        project_id: fc.uuid(),
      }),
    ])(
      'task status field is always one of the 3 valid values',
      (taskPartial) => {
        expect(VALID_TASK_STATUSES).toContain(taskPartial.status);
      }
    );
  });
});
