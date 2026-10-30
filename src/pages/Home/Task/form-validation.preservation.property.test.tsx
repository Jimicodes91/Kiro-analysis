import { taskStatuses } from '@/lib/constants';
import { taskFormSchema } from '@/utils/validation-schema/task';
import { fc, test } from '@fast-check/vitest';
import { describe, expect } from 'vitest';

/**
 * Property-Based Tests for Form Validation and Submission Preservation
 *
 * **Validates: Requirements 3.3**
 *
 * These tests verify that form validation and submission functionality
 * is preserved across the bugfix implementation. Tests are expected to PASS
 * on UNFIXED code to establish a baseline of correct behavior.
 *
 * Property 2: Preservation - Form Validation and Submission
 *
 * Focus:
 * - Task form schema validates required fields using yup
 * - Schema rejects invalid status values
 * - Schema accepts the 3 status values it allows (pending, in_progress, completed)
 * - taskStatuses constant lists the five statuses the dropdown offers
 *
 * Updated to the current schema: one due_date (not start/end dates), a required visibility.
 */

describe('Form Validation Preservation Property Tests', () => {
  describe('Property 2: Preservation - Task Schema Validates Required Fields', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * Property: For any task form data with all required fields populated correctly,
     * the yup schema SHALL validate successfully.
     */
    test.prop([
      fc.record({
        name: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{2,99}$/),
        task_type_id: fc.oneof(
          fc.constant('task-type-1'),
          fc.constant('task-type-2'),
          fc.constant(undefined)
        ),
        project_type_id: fc.uuid(),
        project_id: fc.uuid(),
        status: fc.constantFrom('pending', 'in_progress', 'completed'),
        description: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,99}$/),
        due_date: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31'), noInvalidDate: true }),
        visibility: fc.constantFrom('inhouse', 'client_facing'),
        is_visible_to_client: fc.boolean(),
        assignees: fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }),
        attachment: fc.constant([]),
      }).filter(data => !isNaN(data.due_date.getTime())),
    ])(
      'accepts valid task form data with all required fields',
      async (taskData) => {
        const validationResult = await taskFormSchema.isValid(taskData);
        expect(validationResult).toBe(true);
      }
    );

    /**
     * **Validates: Requirements 3.3**
     *
     * Property: The schema defines all required fields that must be present
     * for task creation (name, description, status, due_date, visibility,
     * project_id, project_type_id, assignees, is_visible_to_client).
     */
    test('schema defines all required task fields', () => {
      const schemaDescription = taskFormSchema.describe();
      const requiredFields = [
        'name',
        'description',
        'status',
        'due_date',
        'visibility',
        'project_id',
        'project_type_id',
        'assignees',
        'is_visible_to_client',
      ];

      requiredFields.forEach((field) => {
        expect(schemaDescription.fields).toHaveProperty(field);
      });
    });

    /**
     * **Validates: Requirements 3.3**
     *
     * Property: For any task form data missing the name field (empty or too short),
     * the yup schema SHALL reject the data.
     */
    test.prop([
      fc.record({
        name: fc.oneof(fc.constant(''), fc.constant('ab')), // Too short (<3 chars) or empty
        project_type_id: fc.uuid(),
        project_id: fc.uuid(),
        status: fc.constantFrom('pending', 'in_progress', 'completed'),
        description: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,99}$/),
        due_date: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31'), noInvalidDate: true }),
        visibility: fc.constantFrom('inhouse', 'client_facing'),
        is_visible_to_client: fc.boolean(),
        assignees: fc.array(fc.uuid(), { minLength: 1, maxLength: 3 }),
        attachment: fc.constant([]),
      }),
    ])('rejects task form data with invalid name', async (invalidData) => {
      const validationResult = await taskFormSchema.isValid(invalidData);
      expect(validationResult).toBe(false);
    });

    /**
     * **Validates: Requirements 3.3**
     *
     * Property: For any task form data missing required assignees (empty array),
     * the yup schema SHALL reject the data.
     */
    test.prop([
      fc.record({
        name: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{2,99}$/),
        project_type_id: fc.uuid(),
        project_id: fc.uuid(),
        status: fc.constantFrom('pending', 'in_progress', 'completed'),
        description: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,99}$/),
        due_date: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31'), noInvalidDate: true }),
        visibility: fc.constantFrom('inhouse', 'client_facing'),
        is_visible_to_client: fc.boolean(),
        assignees: fc.constant([]), // Empty assignees
        attachment: fc.constant([]),
      }),
    ])('rejects task form data with empty assignees', async (invalidData) => {
      const validationResult = await taskFormSchema.isValid(invalidData);
      expect(validationResult).toBe(false);
    });
  });

  describe('Property 2: Preservation - Schema Rejects Invalid Status Values', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * Property: The yup schema only accepts pending, in_progress or completed for status
     * (a .oneOf constraint), so an empty status is rejected.
     */
    test.prop([
      fc.record({
        name: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{2,99}$/),
        project_type_id: fc.uuid(),
        project_id: fc.uuid(),
        status: fc.constant(''), // Empty status string
        description: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,99}$/),
        due_date: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31'), noInvalidDate: true }),
        visibility: fc.constantFrom('inhouse', 'client_facing'),
        is_visible_to_client: fc.boolean(),
        assignees: fc.array(fc.uuid(), { minLength: 1, maxLength: 3 }),
        attachment: fc.constant([]),
      }),
    ])('rejects empty status string (status is required)', async (invalidData) => {
      const validationResult = await taskFormSchema.isValid(invalidData);
      expect(validationResult).toBe(false);
    });

    /**
     * **Validates: Requirements 3.3**
     *
     * Property: The schema requires status field to be present - missing status
     * causes validation failure.
     */
    test('rejects task form data without status field', async () => {
      const invalidData = {
        name: 'Valid task name',
        project_type_id: 'project-type-1',
        project_id: 'project-1',
        // status: missing
        description: 'Some description',
        due_date: new Date('2024-06-30'),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
        attachment: [],
      };
      const validationResult = await taskFormSchema.isValid(invalidData);
      expect(validationResult).toBe(false);
    });

    test('rejects a status value that is not one of the three the schema accepts', async () => {
      const invalidData = {
        name: 'Valid task name',
        project_type_id: 'project-type-1',
        project_id: 'project-1',
        status: 'banana',
        description: 'Some description',
        due_date: new Date('2024-06-30'),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
        attachment: [],
      };
      const validationResult = await taskFormSchema.isValid(invalidData);
      expect(validationResult).toBe(false);
    });
  });

  describe('Property 2: Preservation - Schema Accepts All 3 Valid Status Values', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * Property: For any of the 3 valid task status values (pending, in_progress,
     * completed), the yup schema SHALL accept the form data when all other fields
     * are valid.
     */
    test.prop([
      fc.record({
        name: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{2,99}$/),
        project_type_id: fc.uuid(),
        project_id: fc.uuid(),
        status: fc.constantFrom('pending', 'in_progress', 'completed'),
        description: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,99}$/),
        due_date: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31'), noInvalidDate: true }),
        visibility: fc.constantFrom('inhouse', 'client_facing'),
        is_visible_to_client: fc.boolean(),
        assignees: fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }),
        attachment: fc.constant([]),
      }).filter(data => !isNaN(data.due_date.getTime())),
    ])(
      'accepts all 3 valid task status values (pending, in_progress, completed)',
      async (taskData) => {
        const validationResult = await taskFormSchema.isValid(taskData);
        expect(validationResult).toBe(true);

        // Confirm the status is one of the 3 allowed values
        expect(['pending', 'in_progress', 'completed']).toContain(taskData.status);
      }
    );

    /**
     * **Validates: Requirements 3.3**
     *
     * Property: Each individual valid status value produces a valid schema result.
     */
    test.each(['pending', 'in_progress', 'completed'])(
      'accepts status value "%s" individually',
      async (status) => {
        const validData = {
          name: 'Valid task name',
          project_type_id: 'project-type-1',
          project_id: 'project-1',
          status,
          description: 'A valid description',
          due_date: new Date('2024-06-30'),
        visibility: 'inhouse',
          is_visible_to_client: false,
          assignees: ['user-1'],
          attachment: [],
        };

        const validationResult = await taskFormSchema.isValid(validData);
        expect(validationResult).toBe(true);
      }
    );
  });

  describe('Property 2: Preservation - taskStatuses Constant Structure', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * Property: The taskStatuses constant lists the five statuses the task dropdown
     * offers (Draft, Sent, In Progress, Completed, Archived), each with a label and a value.
     */
    test('taskStatuses constant has exactly 5 entries with correct structure', () => {
      expect(taskStatuses).toBeDefined();
      expect(Array.isArray(taskStatuses)).toBe(true);
      expect(taskStatuses).toHaveLength(5);
      // Each entry has label and value
      taskStatuses.forEach((status) => {
        expect(status).toHaveProperty('label');
        expect(status).toHaveProperty('value');
        expect(typeof status.label).toBe('string');
        expect(typeof status.value).toBe('string');
      });
    });

    test('taskStatuses constant has correct ordering and values', () => {
      expect(taskStatuses).toEqual([
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ]);
    });

    test('the dropdown and the schema share in_progress and completed', async () => {
      // draft, sent and archived are offered by the dropdown but not accepted by the schema
      // (see the KNOWN MISMATCH test in status-functionality.preservation.property.test.ts).
      const statusValues = taskStatuses.map((s) => s.value);
      const shared = statusValues.filter((status) => ['in_progress', 'completed'].includes(status));
      expect(shared).toEqual(['in_progress', 'completed']);

      for (const status of shared) {
        const validData = {
          name: 'Test task',
          project_type_id: 'type-1',
          project_id: 'proj-1',
          status,
          description: 'Description',
          due_date: new Date('2024-06-30'),
          visibility: 'inhouse',
          is_visible_to_client: false,
          assignees: ['user-1'],
          attachment: [],
        };
        const isValid = await taskFormSchema.isValid(validData);
        expect(isValid).toBe(true);
      }
    });

    /**
     * **Validates: Requirements 3.3**
     *
     * Property: The taskStatuses constant labels provide proper display formatting
     * with title case and correct spacing (e.g. "In Progress" not "Inprogress").
     */
    test.prop([
      fc.integer({ min: 0, max: 4 }),
    ])('taskStatuses labels are title-cased and properly spaced', (index) => {
      const status = taskStatuses[index];
      // Each word should start with uppercase
      const words = status.label.split(' ');
      words.forEach((word) => {
        expect(word[0]).toBe(word[0].toUpperCase());
      });
      // Label should not contain underscores
      expect(status.label).not.toContain('_');
    });
  });

  describe('Property 2: Preservation - Form Submission Requires a Due Date', () => {
    /**
     * **Validates: Requirements 3.3**
     *
     * Property: For any task form submission, due_date is a required field.
     * Tasks used to have a start and end date; they now have one due date.
     */
    test.prop([
      fc.record({
        name: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{2,99}$/),
        project_type_id: fc.uuid(),
        project_id: fc.uuid(),
        status: fc.constantFrom('pending', 'in_progress', 'completed'),
        description: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,99}$/),
        is_visible_to_client: fc.boolean(),
        assignees: fc.array(fc.uuid(), { minLength: 1, maxLength: 3 }),
        attachment: fc.constant([]),
        visibility: fc.constantFrom('inhouse', 'client_facing'),
        // Deliberately omitting due_date
      }),
    ])(
      'rejects form data missing the due date',
      async (incompleteData) => {
        const validationResult = await taskFormSchema.isValid(incompleteData);
        expect(validationResult).toBe(false);
      }
    );

    /**
     * **Validates: Requirements 3.3**
     *
     * Property: Including a valid due date makes the form valid.
     */
    test.prop([
      fc.record({
        name: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{2,99}$/),
        project_type_id: fc.uuid(),
        project_id: fc.uuid(),
        status: fc.constantFrom('pending', 'in_progress', 'completed'),
        description: fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,99}$/),
        due_date: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31'), noInvalidDate: true }),
        visibility: fc.constantFrom('inhouse', 'client_facing'),
        is_visible_to_client: fc.boolean(),
        assignees: fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }),
        attachment: fc.constant([]),
      }).filter(data => !isNaN(data.due_date.getTime())),
    ])(
      'accepts form data with a due date present',
      async (taskData) => {
        const validationResult = await taskFormSchema.isValid(taskData);
        expect(validationResult).toBe(true);
      }
    );
  });
});
