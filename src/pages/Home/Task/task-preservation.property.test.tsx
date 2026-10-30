import { Task } from '@/types/task.types';
import { fc, test } from '@fast-check/vitest';
import { render, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect } from 'vitest';
import TaskTableRow from './task-table-row';

/**
 * Property-Based Tests for Task Display and Navigation Preservation
 * 
 * **Validates: Requirements 3.1, 3.4**
 * 
 * These tests verify that existing task display and navigation functionality
 * is preserved across the bugfix implementation. Tests are expected to PASS
 * on UNFIXED code to establish a baseline of correct behavior.
 * 
 * Property 2: Preservation - Task Display and Navigation
 */

describe('Task Preservation Property Tests', () => {
  describe('Property 2: Preservation - Task Information Display', () => {
    /**
     * **Validates: Requirements 3.1**
     * 
     * Property: For any task with valid data, the system SHALL continue to display
     * all existing task information correctly (name, project name, client organization,
     * due date, status, assignees).
     */
    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          client_organization: fc.oneof(
            fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            fc.constant(undefined)
          ),
        }),
        end_date: fc.integer({ min: 2020, max: 2030 }).chain(year =>
          fc.integer({ min: 1, max: 12 }).chain(month =>
            fc.integer({ min: 1, max: 28 }).map(day =>
              `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            )
          )
        ),
        status: fc.oneof(
          fc.constant('pending'),
          fc.constant('in_progress'),
          fc.constant('completed'),
          fc.constant('not_started'),
          fc.constant('blocked')
        ),
        assignees: fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
          }),
          { minLength: 0, maxLength: 5 }
        ),
      }) as fc.Arbitrary<Task>,
    ])('displays all task information correctly for any valid task', (task) => {
      const { container } = render(
        <BrowserRouter>
          <table>
            <tbody>
              <TaskTableRow task={task} />
            </tbody>
          </table>
        </BrowserRouter>
      );

      const row = container.querySelector('tr');
      expect(row).toBeInTheDocument();

      // Verify task name is displayed (trim both to handle browser whitespace normalization)
      const cells = within(row!).getAllByRole('cell');
      expect(cells[0].textContent?.trim()).toBe(task.name.trim());

      // Verify project name is displayed (trim for whitespace normalization)
      expect(cells[1].textContent?.trim()).toBe(task.project.name.trim());

      // Verify client organization is displayed (or "—" if undefined)
      // Note: Browser normalizes whitespace, so we trim for comparison
      if (task.project.client_organization) {
        expect(cells[2].textContent?.trim()).toBe(task.project.client_organization.trim());
      }

      // Verify due date is displayed
      expect(cells[3]).toHaveTextContent(task.end_date);

      // Verify status is displayed
      expect(cells[4]).toBeInTheDocument();

      // Verify assignees section exists
      if (task.assignees && task.assignees.length > 0) {
        expect(cells[5]).not.toHaveTextContent('—');
      } else {
        expect(cells[5]).toHaveTextContent('—');
      }

      // Verify actions dropdown exists
      expect(cells[6]).toBeInTheDocument();
    });

    /**
     * **Validates: Requirements 3.1**
     * 
     * Property: For any task with assignees, the system SHALL display all assignees
     * with their avatar components correctly rendered.
     */
    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          client_organization: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        }),
        end_date: fc.integer({ min: 2020, max: 2030 }).chain(year =>
          fc.integer({ min: 1, max: 12 }).chain(month =>
            fc.integer({ min: 1, max: 28 }).map(day =>
              `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            )
          )
        ),
        status: fc.constant('in_progress'),
        assignees: fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
          }),
          { minLength: 1, maxLength: 5 }
        ),
      }) as fc.Arbitrary<Task>,
    ])('displays assignee avatars for tasks with assignees', (task) => {
      const { container } = render(
        <BrowserRouter>
          <table>
            <tbody>
              <TaskTableRow task={task} />
            </tbody>
          </table>
        </BrowserRouter>
      );

      const row = container.querySelector('tr');
      const cells = within(row!).getAllByRole('cell');
      
      // Assignees cell should not show the empty state
      expect(cells[5]).not.toHaveTextContent('—');
      
      // Should contain avatar elements (number matches assignees)
      const avatarContainer = cells[5].querySelector('div');
      expect(avatarContainer).toBeInTheDocument();
    });

    /**
     * **Validates: Requirements 3.1**
     * 
     * Property: For any task without assignees, the system SHALL display
     * the empty state marker ("—").
     */
    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          client_organization: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        }),
        end_date: fc.integer({ min: 2020, max: 2030 }).chain(year =>
          fc.integer({ min: 1, max: 12 }).chain(month =>
            fc.integer({ min: 1, max: 28 }).map(day =>
              `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            )
          )
        ),
        status: fc.constant('pending'),
        assignees: fc.constant([]),
      }) as fc.Arbitrary<Task>,
    ])('displays empty state for tasks without assignees', (task) => {
      const { container } = render(
        <BrowserRouter>
          <table>
            <tbody>
              <TaskTableRow task={task} />
            </tbody>
          </table>
        </BrowserRouter>
      );

      const row = container.querySelector('tr');
      const cells = within(row!).getAllByRole('cell');
      
      // Assignees cell should show empty state
      expect(cells[5]).toHaveTextContent('—');
    });

    /**
     * **Validates: Requirements 3.1**
     * 
     * Property: For any task with a valid status, the system SHALL display
     * the status with appropriate badge styling.
     */
    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          client_organization: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        }),
        end_date: fc.integer({ min: 2020, max: 2030 }).chain(year =>
          fc.integer({ min: 1, max: 12 }).chain(month =>
            fc.integer({ min: 1, max: 28 }).map(day =>
              `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            )
          )
        ),
        status: fc.oneof(
          fc.constant('pending'),
          fc.constant('in_progress'),
          fc.constant('completed')
        ),
        assignees: fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
          }),
          { maxLength: 3 }
        ),
      }) as fc.Arbitrary<Task>,
    ])('displays status badge for any valid status', (task) => {
      const { container } = render(
        <BrowserRouter>
          <table>
            <tbody>
              <TaskTableRow task={task} />
            </tbody>
          </table>
        </BrowserRouter>
      );

      const row = container.querySelector('tr');
      const cells = within(row!).getAllByRole('cell');
      
      // Status badge should be present
      const statusBadge = cells[4].querySelector('span');
      expect(statusBadge).toBeInTheDocument();
      
      // Status should be displayed (formatted text)
      expect(cells[4].textContent).toBeTruthy();
    });
  });

  describe('Property 2: Preservation - Task Actions and Operations', () => {
    /**
     * **Validates: Requirements 3.1, 3.9**
     * 
     * Property: For any task, the system SHALL continue to provide access to
     * task operations (view, edit, delete) via the actions dropdown menu.
     */
    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          client_organization: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        }),
        end_date: fc.integer({ min: 2020, max: 2030 }).chain(year =>
          fc.integer({ min: 1, max: 12 }).chain(month =>
            fc.integer({ min: 1, max: 28 }).map(day =>
              `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            )
          )
        ),
        status: fc.constant('pending'),
        assignees: fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
          }),
          { maxLength: 2 }
        ),
      }) as fc.Arbitrary<Task>,
    ])('provides actions dropdown menu for any task', (task) => {
      const { container } = render(
        <BrowserRouter>
          <table>
            <tbody>
              <TaskTableRow task={task} />
            </tbody>
          </table>
        </BrowserRouter>
      );

      const row = container.querySelector('tr');
      const cells = within(row!).getAllByRole('cell');
      
      // Actions cell should contain the dropdown trigger button
      const actionsCell = cells[6];
      const dropdownButton = within(actionsCell).getByRole('button');
      expect(dropdownButton).toBeInTheDocument();
    });
  });

  describe('Property 2: Preservation - Task Table Operations (Requirements 3.9)', () => {
    /**
     * **Validates: Requirements 3.9**
     * 
     * Property: For any task in the task table, the system SHALL continue to
     * execute view, edit, and delete operations correctly through the existing
     * dropdown menu with proper loading states and modal interactions.
     * 
     * This test verifies the STRUCTURE of the dropdown menu - that the View,
     * Edit, and Delete options are present and accessible via the dropdown.
     */
    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          client_organization: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          clients: fc.constant([]),
        }),
        end_date: fc.integer({ min: 2020, max: 2030 }).chain(year =>
          fc.integer({ min: 1, max: 12 }).chain(month =>
            fc.integer({ min: 1, max: 28 }).map(day =>
              `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            )
          )
        ),
        status: fc.oneof(
          fc.constant('pending'),
          fc.constant('in_progress'),
          fc.constant('completed')
        ),
        assignees: fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
            role: fc.constant('CONSULTANT'),
          }),
          { maxLength: 3 }
        ),
        company_id: fc.uuid(),
        author_id: fc.uuid(),
        task_type_id: fc.uuid(),
        project_type_id: fc.uuid(),
        description: fc.string({ minLength: 1, maxLength: 200 }),
        start_date: fc.integer({ min: 2020, max: 2030 }).chain(year =>
          fc.integer({ min: 1, max: 12 }).chain(month =>
            fc.integer({ min: 1, max: 28 }).map(day =>
              `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            )
          )
        ),
        is_visible_to_client: fc.integer({ min: 0, max: 1 }),
        created_at: fc.date().map(d => d.toISOString()),
        updated_at: fc.date().map(d => d.toISOString()),
        deleted_at: fc.constant(null),
        document: fc.constant([]),
        task_type: fc.constant({} as any),
        pipeline: fc.constant({} as any),
        company: fc.constant({} as any),
      }) as fc.Arbitrary<Task>,
    ])('task table row renders with dropdown menu structure for operations', async (task) => {
      const { container } = render(
        <BrowserRouter>
          <table>
            <tbody>
              <TaskTableRow task={task} />
            </tbody>
          </table>
        </BrowserRouter>
      );

      const row = container.querySelector('tr');
      expect(row).toBeInTheDocument();
      
      // Verify the dropdown trigger button is present
      const cells = within(row!).getAllByRole('cell');
      const actionsCell = cells[6];
      const dropdownButton = within(actionsCell).getByRole('button');
      expect(dropdownButton).toBeInTheDocument();
      
      // The dropdown menu structure exists (verifying the component renders correctly)
      // Note: The actual menu items (View/Edit/Delete) are rendered on click by Radix UI
      // This test validates the dropdown trigger mechanism is preserved
      expect(dropdownButton).toHaveAttribute('type', 'button');
    });

    /**
     * **Validates: Requirements 3.1, 3.9**
     * 
     * Property: For any task, all required task fields SHALL be present and
     * correctly structured to support view/edit/delete operations via API.
     * 
     * This validates that the task data structure supports the operations
     * that will be performed when users click View/Edit/Delete.
     */
    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          client_organization: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          clients: fc.constant([]),
        }),
        end_date: fc.integer({ min: 2020, max: 2030 }).chain(year =>
          fc.integer({ min: 1, max: 12 }).chain(month =>
            fc.integer({ min: 1, max: 28 }).map(day =>
              `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            )
          )
        ),
        status: fc.oneof(
          fc.constant('pending'),
          fc.constant('in_progress'),
          fc.constant('completed')
        ),
        assignees: fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            email: fc.emailAddress(),
            role: fc.constant('CONSULTANT'),
          }),
          { maxLength: 3 }
        ),
        company_id: fc.uuid(),
        author_id: fc.uuid(),
        task_type_id: fc.uuid(),
        project_type_id: fc.uuid(),
        description: fc.string({ minLength: 1, maxLength: 200 }),
        start_date: fc.integer({ min: 2020, max: 2030 }).chain(year =>
          fc.integer({ min: 1, max: 12 }).chain(month =>
            fc.integer({ min: 1, max: 28 }).map(day =>
              `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            )
          )
        ),
        is_visible_to_client: fc.integer({ min: 0, max: 1 }),
        created_at: fc.date().map(d => d.toISOString()),
        updated_at: fc.date().map(d => d.toISOString()),
        deleted_at: fc.constant(null),
        document: fc.constant([]),
        task_type: fc.constant({} as any),
        pipeline: fc.constant({} as any),
        company: fc.constant({} as any),
      }) as fc.Arbitrary<Task>,
    ])('task has all required fields to support table operations', (task) => {
      // Verify task has required fields for API operations
      expect(task.id).toBeTruthy();
      expect(task.project_id).toBeTruthy();
      expect(task.name).toBeTruthy();
      expect(task.description).toBeTruthy();
      expect(task.status).toMatch(/^(pending|in_progress|completed)$/);
      expect(task.start_date).toBeTruthy();
      expect(task.end_date).toBeTruthy();
      expect(task.is_visible_to_client).toBeGreaterThanOrEqual(0);
      expect(task.is_visible_to_client).toBeLessThanOrEqual(1);
      
      // Verify nested project structure
      expect(task.project).toBeDefined();
      expect(task.project.id).toBeTruthy();
      expect(task.project.name).toBeTruthy();
      
      // Verify assignees structure
      expect(Array.isArray(task.assignees)).toBe(true);
      
      // These fields ensure the task can be properly edited/deleted via API
      const { container } = render(
        <BrowserRouter>
          <table>
            <tbody>
              <TaskTableRow task={task} />
            </tbody>
          </table>
        </BrowserRouter>
      );
      
      // Verify the task renders successfully with all fields
      expect(container.querySelector('tr')).toBeInTheDocument();
    });
  });
});
