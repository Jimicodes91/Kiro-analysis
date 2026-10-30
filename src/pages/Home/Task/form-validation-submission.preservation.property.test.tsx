import { taskStatuses } from '@/lib/constants';
import { taskFormSchema } from '@/utils/validation-schema/task';
import { fc, test } from '@fast-check/vitest';
import { describe, expect } from 'vitest';

/**
 * Preservation Property Tests - Form Validation and Submission
 * 
 * **Validates: Requirements 3.3**
 * 
 * **IMPORTANT**: These tests follow observation-first methodology
 * - Observe behavior on UNFIXED code for form operations
 * - Observe that task creation forms validate correctly with yup schemas
 * - Observe that form submission validates required fields
 * - Write property-based tests capturing form validation behaviors
 * 
 * **EXPECTED OUTCOME**: Tests PASS on unfixed code (confirms baseline behavior to preserve)
 * - If tests PASS: Baseline behavior confirmed - preserve this during fixes
 * - If tests FAIL unexpectedly: Investigation needed - baseline may be broken
 * 
 * This is Wave 1 preservation test for BUG-5 (Multiple Incompatible Status Sets)
 * Ensures form validation remains functional before implementing status display standardization
 *
 * Updated to match the current schema: tasks have one due_date (not start/end dates), a required
 * visibility, an optional description, and the dropdown lists five statuses.
 */

describe('BUG-5: Form Validation and Submission - Preservation Properties', () => {
  describe('Property 2: Preservation - Task Form Validation with Yup Schema', () => {
    
    test('taskFormSchema validates required fields correctly', async () => {
      // Valid task form data
      const validData = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        due_date: new Date('2025-01-31'),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1', 'user-2'],
        attachment: [],
      };

      // Should validate without errors
      await expect(taskFormSchema.validate(validData)).resolves.toBeTruthy();
    });

    test('taskFormSchema rejects missing required fields', async () => {
      const incompleteData = {
        name: 'Test Task',
        // Missing required fields
      };

      await expect(taskFormSchema.validate(incompleteData)).rejects.toThrow();
    });

    test('taskFormSchema validates task name length', async () => {
      const shortNameData = {
        name: 'ab', // Too short (< 3 characters)
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        due_date: new Date(),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
      };

      await expect(taskFormSchema.validate(shortNameData)).rejects.toThrow(
        'Task name must be at least 3 characters'
      );
    });

    test('taskFormSchema requires project_type_id (Pipeline)', async () => {
      const noPipelineData = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        // project_type_id missing
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        due_date: new Date(),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
      };

      await expect(taskFormSchema.validate(noPipelineData)).rejects.toThrow(
        'Pipeline is required'
      );
    });

    test('taskFormSchema requires project_id', async () => {
      const noProjectData = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        // project_id missing
        description: 'Test description',
        status: 'pending',
        due_date: new Date(),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
      };

      await expect(taskFormSchema.validate(noProjectData)).rejects.toThrow(
        'Project is required'
      );
    });

    test('taskFormSchema treats description as optional', async () => {
      // Description used to be required; the schema now makes it optional.
      const noDescriptionData = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        // description omitted
        status: 'pending',
        due_date: new Date(),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
      };

      await expect(taskFormSchema.validate(noDescriptionData)).resolves.toBeTruthy();
    });

    test('taskFormSchema requires due_date', async () => {
      // Tasks moved from start_date / end_date to a single due_date.
      const noDueDateData = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        // due_date missing
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
      };

      await expect(taskFormSchema.validate(noDueDateData)).rejects.toThrow(
        'Due date is required'
      );
    });

    test('taskFormSchema requires visibility', async () => {
      const noVisibilityData = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        due_date: new Date(),
        // visibility missing
        is_visible_to_client: false,
        assignees: ['user-1'],
      };

      await expect(taskFormSchema.validate(noVisibilityData)).rejects.toThrow(
        'Visibility is required'
      );
    });

    test('taskFormSchema only accepts inhouse or client_facing visibility', async () => {
      const badVisibility = {
        name: 'Test Task',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        status: 'pending',
        due_date: new Date(),
        visibility: 'everyone',
        assignees: ['user-1'],
      };

      await expect(taskFormSchema.validate(badVisibility)).rejects.toThrow(
        'Visibility must be either inhouse or client_facing'
      );
    });

    test('taskFormSchema requires status field', async () => {
      const noStatusData = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        // status missing
        due_date: new Date(),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
      };

      await expect(taskFormSchema.validate(noStatusData)).rejects.toThrow(
        'Status is required'
      );
    });

    test('taskFormSchema requires at least one assignee', async () => {
      const noAssigneesData = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        due_date: new Date(),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: [], // Empty array
      };

      await expect(taskFormSchema.validate(noAssigneesData)).rejects.toThrow(
        'At least one assignee is required'
      );
    });

    test('taskFormSchema has default for is_visible_to_client', async () => {
      const dataWithoutVisibility = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        due_date: new Date(),
        visibility: 'inhouse',
        // is_visible_to_client omitted
        assignees: ['user-1'],
      };

      const validated = await taskFormSchema.validate(dataWithoutVisibility);
      expect(validated.is_visible_to_client).toBe(false);
    });
  });

  describe('Property 2: Preservation - Task Status Values Acceptance', () => {
    test.prop([
      fc.constantFrom('pending', 'in_progress', 'completed'),
    ])('taskFormSchema accepts all 3 existing task status values', async (status) => {
      const taskData = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: status,
        due_date: new Date('2025-01-31'),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
      };

      // All 3 status values should validate successfully
      await expect(taskFormSchema.validate(taskData)).resolves.toBeTruthy();
    });

    test('taskStatuses constant defines the five dropdown statuses', () => {
      // The dropdown offers draft, sent, in progress, completed and archived. The schema above
      // accepts a different set; see the KNOWN MISMATCH test in status-functionality.preservation.
      expect(taskStatuses.map((s) => s.value)).toEqual([
        'draft',
        'sent',
        'in_progress',
        'completed',
        'archived',
      ]);
    });

    test('taskStatuses constant provides proper display labels', () => {
      expect(taskStatuses.map((s) => s.label)).toEqual([
        'Draft',
        'Sent',
        'In Progress',
        'Completed',
        'Archived',
      ]);
    });
  });

  describe('Property 2: Preservation - File Attachment Validation', () => {
    test('taskFormSchema accepts optional attachment field', async () => {
      const dataWithoutAttachment = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        due_date: new Date(),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
        // attachment omitted
      };

      await expect(taskFormSchema.validate(dataWithoutAttachment)).resolves.toBeTruthy();
    });

    test('taskFormSchema accepts empty attachment array', async () => {
      const dataWithEmptyAttachment = {
        name: 'Test Task',
        task_type_id: 'task-type-123',
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        due_date: new Date(),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
        attachment: [],
      };

      await expect(taskFormSchema.validate(dataWithEmptyAttachment)).resolves.toBeTruthy();
    });
  });

  describe('Property 2: Preservation - Form Data Structure', () => {
    test.prop([
      fc.record({
        name: fc.string({ minLength: 3, maxLength: 100 }),
        task_type_id: fc.uuid(),
        project_type_id: fc.uuid(),
        project_id: fc.uuid(),
        description: fc.string({ minLength: 1, maxLength: 500 }),
        status: fc.constantFrom('pending', 'in_progress', 'completed'),
        due_date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31'), noInvalidDate: true }),
        visibility: fc.constantFrom('inhouse', 'client_facing'),
        is_visible_to_client: fc.boolean(),
        assignees: fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }),
        attachment: fc.constant([]),
      }),
    ])('taskFormSchema validates various valid task form data structures', async (taskData) => {

      await expect(taskFormSchema.validate(taskData)).resolves.toBeTruthy();
    });
  });

  describe('Property 2: Preservation - Task Type ID Optionality', () => {
    test('taskFormSchema allows optional task_type_id', async () => {
      const dataWithoutTaskType = {
        name: 'Test Task',
        // task_type_id omitted (it's optional)
        project_type_id: 'project-type-456',
        project_id: 'project-789',
        description: 'Test description',
        status: 'pending',
        due_date: new Date(),
        visibility: 'inhouse',
        is_visible_to_client: false,
        assignees: ['user-1'],
      };

      await expect(taskFormSchema.validate(dataWithoutTaskType)).resolves.toBeTruthy();
    });
  });
});
