import { formatTaskStatus } from '@/lib/utils';
import { Task } from '@/types/task.types';
import { fc, test } from '@fast-check/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect } from 'vitest';
import TaskTableRow from './task-table-row';

/**
 * Preservation Property Tests - Task Table Operations
 *
 * **Validates: Requirements 3.1, 3.9**
 *
 * **IMPORTANT**: This test follows observation-first methodology for BUG-9
 * (Minimal Task Table Features).
 *
 * Captures baseline task table behavior BEFORE adding filters and enhanced headers:
 * - Task table displays all task information correctly
 * - View/edit/delete operations work via dropdown
 * - Table renders correct number of rows matching provided data
 *
 * **EXPECTED OUTCOME**: Tests PASS on unfixed code (confirms baseline behavior to preserve)
 */

// Alphanumeric string generator that avoids whitespace-only or special characters
const alphaString = (min: number, max: number) =>
  fc.stringMatching(/^[A-Za-z][A-Za-z0-9 ]{0,48}[A-Za-z0-9]$/).filter(
    (s) => s.length >= min && s.length <= max
  );

// Realistic task name generator
const taskNameArb = fc
  .tuple(
    fc.constantFrom('Setup', 'Review', 'Complete', 'Draft', 'Fix', 'Update', 'Build', 'Plan'),
    fc.constantFrom('module', 'feature', 'report', 'dashboard', 'form', 'layout', 'API', 'tests'),
    fc.constantFrom('v1', 'v2', 'alpha', 'beta', 'final', 'prod', 'staging', 'dev')
  )
  .map(([verb, noun, suffix]) => `${verb} ${noun} ${suffix}`);

// Realistic project name generator
const projectNameArb = fc
  .tuple(
    fc.constantFrom('Immigration', 'Finance', 'Marketing', 'Sales', 'Engineering', 'Design'),
    fc.constantFrom('Project', 'Initiative', 'Program', 'Module', 'System'),
    fc.constantFrom('Alpha', 'Beta', 'Gamma', 'Delta', 'One', 'Two')
  )
  .map(([dept, type, ver]) => `${dept} ${type} ${ver}`);

// Realistic company name generator
const companyNameArb = fc.constantFrom(
  'Acme Corp',
  'TechStart Inc',
  'Global Solutions',
  'DataWave LLC',
  'CloudFirst Ltd',
  'NextGen Systems'
);

// Date generator in YYYY-MM-DD format (using integers to avoid Invalid Date issues)
const dateArb = fc
  .integer({ min: 2022, max: 2028 })
  .chain((year) =>
    fc.integer({ min: 1, max: 12 }).chain((month) =>
      fc.integer({ min: 1, max: 28 }).map(
        (day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      )
    )
  );

// Full Task arbitrary generator
const taskArbitrary: fc.Arbitrary<Task> = fc.record({
  id: fc.uuid(),
  name: taskNameArb,
  project_id: fc.uuid(),
  project: fc.record({
    id: fc.uuid(),
    name: projectNameArb,
    client_organization: companyNameArb,
    clients: fc.constant([]),
  }),
  end_date: dateArb,
  start_date: dateArb,
  status: fc.constantFrom('pending' as const, 'in_progress' as const, 'completed' as const),
  assignees: fc.array(
    fc.record({
      id: fc.uuid(),
      name: fc.constantFrom('Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince'),
      email: fc.constantFrom('alice@test.com', 'bob@test.com', 'charlie@test.com', 'diana@test.com'),
      role: fc.constantFrom('ADMIN', 'CONSULTANT'),
    }),
    { minLength: 0, maxLength: 3 }
  ),
  description: fc.constant('Task description placeholder'),
  is_visible_to_client: fc.integer({ min: 0, max: 1 }),
  document: fc.constant([]),
  company_id: fc.uuid(),
  author_id: fc.uuid(),
  task_type_id: fc.uuid(),
  project_type_id: fc.uuid(),
  created_at: fc.constant('2024-01-15T10:00:00.000Z'),
  updated_at: fc.constant('2024-01-15T10:00:00.000Z'),
  deleted_at: fc.constant(null),
  task_type: fc.constant({} as any),
  pipeline: fc.constant({} as any),
  company: fc.constant({} as any),
}) as fc.Arbitrary<Task>;

// Helper to render with providers needed for modals
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('BUG-9: Task Table Operations - Preservation Properties', () => {
  describe('Property 2: Preservation - Task Information Display (Requirement 3.1)', () => {
    test.prop([taskArbitrary])(
      'task table row renders all task info: name, project, client, due date, status',
      (task) => {
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

        const cells = within(row!).getAllByRole('cell');
        // 7 cells: name, project, client org, due date, status, assignees, actions
        expect(cells).toHaveLength(7);

        // Cell 0: task name
        expect(cells[0]).toHaveTextContent(task.name);

        // Cell 1: project name (rendered as link)
        expect(cells[1]).toHaveTextContent(task.project.name);

        // Cell 2: client organization
        expect(cells[2]).toHaveTextContent(task.project.client_organization);

        // Cell 3: due date (end_date)
        expect(cells[3]).toHaveTextContent(task.end_date);

        // Cell 4: status badge with formatted text
        const formattedStatus = formatTaskStatus(task.status).label;
        expect(cells[4]).toHaveTextContent(formattedStatus);
      }
    );

    test.prop([taskArbitrary])(
      'task status badge renders with correct formatted text',
      (task) => {
        const { container } = render(
          <BrowserRouter>
            <table>
              <tbody>
                <TaskTableRow task={task} />
              </tbody>
            </table>
          </BrowserRouter>
        );

        const badge = container.querySelector('.inline-flex');
        expect(badge).toBeInTheDocument();

        const formattedStatus = formatTaskStatus(task.status).label;
        expect(badge).toHaveTextContent(formattedStatus);
      }
    );

    test.prop([taskArbitrary])(
      'assignees render correctly: avatars when present, dash when empty',
      (task) => {
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

        if (task.assignees.length > 0) {
          // Overlapping avatar container should be present
          const avatarContainer = cells[5].querySelector('.flex.-space-x-2');
          expect(avatarContainer).toBeInTheDocument();
          expect(avatarContainer!.children.length).toBe(task.assignees.length);
        } else {
          expect(cells[5]).toHaveTextContent('—');
        }
      }
    );
  });

  describe('Property 2: Preservation - Task Operations via Dropdown (Requirement 3.9)', () => {
    test.prop([taskArbitrary])(
      'action dropdown button is present in actions cell',
      (task) => {
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
        const actionsCell = cells[6];

        const dropdownButton = within(actionsCell).getByRole('button');
        expect(dropdownButton).toBeInTheDocument();
        expect(dropdownButton).toHaveAttribute('type', 'button');
      }
    );

    test.prop([taskArbitrary])(
      'dropdown menu opens and shows View, Edit, Delete options',
      async (task) => {
        const user = userEvent.setup();

        renderWithProviders(
          <table>
            <tbody>
              <TaskTableRow task={task} />
            </tbody>
          </table>
        );

        // Open the dropdown
        const menuButton = screen.getByRole('button');
        await user.click(menuButton);

        // Verify all three action options
        expect(await screen.findByText('View')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
      }
    );
  });

  describe('Property 2: Preservation - Table Row Count', () => {
    test('table renders correct number of rows for multiple tasks', () => {
      const tasks: Task[] = [
        {
          id: '1',
          name: 'Task One',
          project_id: 'p1',
          project: { id: 'p1', name: 'Project A', client_organization: 'Client X', clients: [] },
          end_date: '2024-06-15',
          start_date: '2024-01-01',
          status: 'pending',
          assignees: [],
          description: 'Desc 1',
          is_visible_to_client: 0,
          document: [],
          company_id: 'c1',
          author_id: 'a1',
          task_type_id: 'tt1',
          project_type_id: 'pt1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          deleted_at: null,
          task_type: {} as any,
          pipeline: {} as any,
          company: {} as any,
        },
        {
          id: '2',
          name: 'Task Two',
          project_id: 'p2',
          project: { id: 'p2', name: 'Project B', client_organization: 'Client Y', clients: [] },
          end_date: '2024-07-20',
          start_date: '2024-02-01',
          status: 'in_progress',
          assignees: [{ id: 'u1', name: 'Jane', email: 'jane@test.com', role: 'CONSULTANT' }],
          description: 'Desc 2',
          is_visible_to_client: 1,
          document: [],
          company_id: 'c2',
          author_id: 'a2',
          task_type_id: 'tt2',
          project_type_id: 'pt2',
          created_at: '2024-02-01T00:00:00Z',
          updated_at: '2024-02-01T00:00:00Z',
          deleted_at: null,
          task_type: {} as any,
          pipeline: {} as any,
          company: {} as any,
        },
        {
          id: '3',
          name: 'Task Three',
          project_id: 'p3',
          project: { id: 'p3', name: 'Project C', client_organization: 'Client Z', clients: [] },
          end_date: '2024-08-01',
          start_date: '2024-03-15',
          status: 'completed',
          assignees: [
            { id: 'u2', name: 'John', email: 'john@test.com', role: 'ADMIN' },
            { id: 'u3', name: 'Mary', email: 'mary@test.com', role: 'CONSULTANT' },
          ],
          description: 'Desc 3',
          is_visible_to_client: 0,
          document: [],
          company_id: 'c3',
          author_id: 'a3',
          task_type_id: 'tt3',
          project_type_id: 'pt3',
          created_at: '2024-03-15T00:00:00Z',
          updated_at: '2024-03-15T00:00:00Z',
          deleted_at: null,
          task_type: {} as any,
          pipeline: {} as any,
          company: {} as any,
        },
      ];

      const { container } = render(
        <BrowserRouter>
          <table>
            <tbody>
              {tasks.map((task) => (
                <TaskTableRow key={task.id} task={task} />
              ))}
            </tbody>
          </table>
        </BrowserRouter>
      );

      // Each task should produce one table row
      const rows = container.querySelectorAll('tr');
      expect(rows).toHaveLength(tasks.length);

      // Verify each task's name appears
      expect(screen.getByText('Task One')).toBeInTheDocument();
      expect(screen.getByText('Task Two')).toBeInTheDocument();
      expect(screen.getByText('Task Three')).toBeInTheDocument();
    });
  });

  describe('Property 2: Preservation - Project Link in Table', () => {
    test.prop([taskArbitrary])(
      'project name renders as a clickable link to /projects/:id',
      (task) => {
        render(
          <BrowserRouter>
            <table>
              <tbody>
                <TaskTableRow task={task} />
              </tbody>
            </table>
          </BrowserRouter>
        );

        const link = screen.getByText(task.project.name).closest('a');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `/projects/${task.project.id}`);
      }
    );
  });
});
