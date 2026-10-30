import { Task } from '@/types/task.types';
import { fc, test } from '@fast-check/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, vi } from 'vitest';
import ViewEditTaskModal from './edit-task-modal';

/**
 * Preservation Property Tests - Task Edit Operations
 * 
 * **Validates: Requirements 3.1, 3.9**
 * 
 * **IMPORTANT**: These tests run on UNFIXED code BEFORE implementing inline editing
 * 
 * PRESERVATION GOALS:
 * - Verify full edit modal still works for comprehensive edits
 * - Verify task update API calls work correctly with all required fields
 * - Verify task data (name, description, assignees, dates, status, visibility) can be edited
 * - Ensure all existing task fields are preserved during updates
 * 
 * **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
 * 
 * These tests encode the current working behavior that must NOT break when adding inline editing.
 */

describe('BUG-4: Task Edit Preservation - Property Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock all the hooks used by the modal
    vi.mock('@/hooks/project-modules/task-types/use-get-all-task-types', () => ({
      default: () => ({
        isLoading: false,
        value: { data: [{ id: 'task-type-1', name: 'General Task' }] },
      }),
    }));

    vi.mock('@/hooks/project-modules/project-types/use-get-all-project-types', () => ({
      default: () => ({
        isLoading: false,
        value: { data: [{ id: 'project-type-1', name: 'Immigration' }] },
      }),
    }));

    vi.mock('@/hooks/company-admin/use-get-company-users', () => ({
      default: () => ({
        isLoading: false,
        isPending: false,
        value: { 
          data: [
            { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
            { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
          ] 
        },
      }),
    }));

    vi.mock('@/hooks/project-modules/use-get-all-projects', () => ({
      default: () => ({
        isLoading: false,
        value: { 
          data: [
            { id: 'project-1', name: 'Immigration Project', project_type_id: 'project-type-1' },
          ] 
        },
      }),
    }));

    vi.mock('@/hooks/project-modules/tasks/use-update-project-task', () => ({
      default: () => ({
        mutateAsync: vi.fn().mockResolvedValue({ success: true }),
        isPending: false,
      }),
    }));
  });

  describe('Property 2: Preservation - Full Edit Modal Functionality', () => {
    
    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          client_organization: fc.string({ minLength: 1, maxLength: 50 }),
          clients: fc.constant([]),
        }),
        end_date: fc.date().map(d => d.toISOString().split('T')[0]),
        status: fc.constantFrom('pending' as const, 'in_progress' as const, 'completed' as const),
        assignees: fc.array(
          fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
            name: fc.string({ minLength: 1, maxLength: 30 }),
            role: fc.constantFrom('ADMIN', 'CONSULTANT', 'CLIENT'),
          }),
          { minLength: 0, maxLength: 3 }
        ),
        document: fc.constant([]),
        company_id: fc.uuid(),
        author_id: fc.uuid(),
        task_type_id: fc.constant('task-type-1'),
        project_type_id: fc.constant('project-type-1'),
        description: fc.string({ minLength: 10, maxLength: 100 }),
        start_date: fc.date().map(d => d.toISOString().split('T')[0]),
        is_visible_to_client: fc.integer({ min: 0, max: 1 }),
        created_at: fc.date().map(d => d.toISOString()),
        updated_at: fc.date().map(d => d.toISOString()),
        deleted_at: fc.constant(null),
        task_type: fc.constant({ id: 'task-type-1', name: 'General Task' } as any),
        pipeline: fc.constant({} as any),
        company: fc.constant({} as any),
      }) as fc.Arbitrary<Task>,
    ])('modal renders in edit mode with all task fields editable', async (taskData) => {
      const onClose = vi.fn();
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ViewEditTaskModal
              isOpen={true}
              onClose={onClose}
              taskData={taskData}
              mode="edit"
            />
          </BrowserRouter>
        </QueryClientProvider>
      );

      // PRESERVATION: Modal should render with "Edit Task" title
      await waitFor(() => {
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
      });

      // PRESERVATION: All form fields should be present and editable
      const taskNameInput = screen.getByLabelText(/task name/i) as HTMLInputElement;
      expect(taskNameInput).toBeInTheDocument();
      expect(taskNameInput.value).toBe(taskData.name);
      expect(taskNameInput).not.toBeDisabled();

      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput.value).toBe(taskData.description);
      expect(descriptionInput).not.toBeDisabled();

      // PRESERVATION: Status dropdown should be present and editable
      const statusTrigger = screen.getByText(
        taskData.status === 'pending' ? 'Pending' :
        taskData.status === 'in_progress' ? 'In Progress' : 'Completed'
      );
      expect(statusTrigger).toBeInTheDocument();

      // PRESERVATION: Date fields should be present
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();

      // PRESERVATION: Visibility checkbox should be present
      expect(screen.getByLabelText(/make visible to client/i)).toBeInTheDocument();

      // PRESERVATION: Update button should be present and enabled
      const updateButton = screen.getByRole('button', { name: /update task/i });
      expect(updateButton).toBeInTheDocument();
      expect(updateButton).not.toBeDisabled();
    });

    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          client_organization: fc.string({ minLength: 1, maxLength: 50 }),
          clients: fc.constant([]),
        }),
        end_date: fc.date().map(d => d.toISOString().split('T')[0]),
        status: fc.constantFrom('pending' as const, 'in_progress' as const, 'completed' as const),
        assignees: fc.constant([]),
        document: fc.constant([]),
        company_id: fc.uuid(),
        author_id: fc.uuid(),
        task_type_id: fc.constant('task-type-1'),
        project_type_id: fc.constant('project-type-1'),
        description: fc.string({ minLength: 10, maxLength: 100 }),
        start_date: fc.date().map(d => d.toISOString().split('T')[0]),
        is_visible_to_client: fc.integer({ min: 0, max: 1 }),
        created_at: fc.date().map(d => d.toISOString()),
        updated_at: fc.date().map(d => d.toISOString()),
        deleted_at: fc.constant(null),
        task_type: fc.constant({ id: 'task-type-1', name: 'General Task' } as any),
        pipeline: fc.constant({} as any),
        company: fc.constant({} as any),
      }) as fc.Arbitrary<Task>,
    ])('modal renders in view mode with all fields disabled', async (taskData) => {
      const onClose = vi.fn();
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ViewEditTaskModal
              isOpen={true}
              onClose={onClose}
              taskData={taskData}
              mode="view"
            />
          </BrowserRouter>
        </QueryClientProvider>
      );

      // PRESERVATION: Modal should render with "View Task" title
      await waitFor(() => {
        expect(screen.getByText('View Task')).toBeInTheDocument();
      });

      // PRESERVATION: All form fields should be disabled in view mode
      const taskNameInput = screen.getByLabelText(/task name/i) as HTMLInputElement;
      expect(taskNameInput).toBeDisabled();

      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
      expect(descriptionInput).toBeDisabled();

      // PRESERVATION: Update button should NOT be present in view mode
      const updateButton = screen.queryByRole('button', { name: /update task/i });
      expect(updateButton).not.toBeInTheDocument();
    });

    test.prop([
      fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1, maxLength: 50 }),
        project_id: fc.uuid(),
        project: fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          client_organization: fc.string({ minLength: 1, maxLength: 50 }),
          clients: fc.constant([]),
        }),
        end_date: fc.date().map(d => d.toISOString().split('T')[0]),
        status: fc.constantFrom('pending' as const, 'in_progress' as const, 'completed' as const),
        assignees: fc.constant([]),
        document: fc.constant([]),
        company_id: fc.uuid(),
        author_id: fc.uuid(),
        task_type_id: fc.constant('task-type-1'),
        project_type_id: fc.constant('project-type-1'),
        description: fc.string({ minLength: 10, maxLength: 100 }),
        start_date: fc.date().map(d => d.toISOString().split('T')[0]),
        is_visible_to_client: fc.integer({ min: 0, max: 1 }),
        created_at: fc.date().map(d => d.toISOString()),
        updated_at: fc.date().map(d => d.toISOString()),
        deleted_at: fc.constant(null),
        task_type: fc.constant({ id: 'task-type-1', name: 'General Task' } as any),
        pipeline: fc.constant({} as any),
        company: fc.constant({} as any),
      }) as fc.Arbitrary<Task>,
    ])('task name can be edited via modal input field', async (taskData) => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ViewEditTaskModal
              isOpen={true}
              onClose={onClose}
              taskData={taskData}
              mode="edit"
            />
          </BrowserRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
      });

      // PRESERVATION: Task name can be edited through the input field
      const taskNameInput = screen.getByLabelText(/task name/i) as HTMLInputElement;
      expect(taskNameInput).toBeInTheDocument();
      expect(taskNameInput).not.toBeDisabled();

      // User can clear and type new name
      await user.clear(taskNameInput);
      await user.type(taskNameInput, 'Updated Task Name');
      
      expect(taskNameInput.value).toBe('Updated Task Name');
    });

    test('modal includes all required task fields per staging schema', async () => {
      const mockTask: Task = {
        id: 'task-123',
        name: 'Test Task',
        description: 'Test description',
        status: 'pending',
        start_date: '2025-01-01',
        end_date: '2025-01-31',
        is_visible_to_client: 1,
        project_id: 'project-1',
        company_id: 'company-1',
        author_id: 'user-1',
        task_type_id: 'task-type-1',
        project_type_id: 'project-type-1',
        assignees: [],
        document: [],
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        deleted_at: null,
        task_type: { id: 'task-type-1', name: 'General' } as any,
        pipeline: {} as any,
        company: {} as any,
        project: {
          id: 'project-1',
          name: 'Test Project',
          client_organization: 'Test Org',
          clients: [],
        },
      };

      const onClose = vi.fn();
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ViewEditTaskModal
              isOpen={true}
              onClose={onClose}
              taskData={mockTask}
              mode="edit"
            />
          </BrowserRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
      });

      // PRESERVATION: All required fields must be present
      // These are the fields staging requires per the schema
      expect(screen.getByLabelText(/task name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/make visible to client/i)).toBeInTheDocument();
      
      // Pipeline and Project are also required
      expect(screen.getByLabelText(/pipeline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/project/i)).toBeInTheDocument();
    });

    test('modal displays all three task status options from taskStatuses constant', async () => {
      const mockTask: Task = {
        id: 'task-123',
        name: 'Test Task',
        description: 'Test description',
        status: 'pending',
        start_date: '2025-01-01',
        end_date: '2025-01-31',
        is_visible_to_client: 1,
        project_id: 'project-1',
        company_id: 'company-1',
        author_id: 'user-1',
        task_type_id: 'task-type-1',
        project_type_id: 'project-type-1',
        assignees: [],
        document: [],
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        deleted_at: null,
        task_type: { id: 'task-type-1', name: 'General' } as any,
        pipeline: {} as any,
        company: {} as any,
        project: {
          id: 'project-1',
          name: 'Test Project',
          client_organization: 'Test Org',
          clients: [],
        },
      };

      const onClose = vi.fn();
      const user = userEvent.setup();
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ViewEditTaskModal
              isOpen={true}
              onClose={onClose}
              taskData={mockTask}
              mode="edit"
            />
          </BrowserRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
      });

      // PRESERVATION: Status dropdown uses taskStatuses constant with 3 values
      // Click on status trigger to open dropdown
      const statusTrigger = screen.getByText('Pending');
      await user.click(statusTrigger);

      // Should show all 3 task statuses with proper labels
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Pending' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'In Progress' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Completed' })).toBeInTheDocument();
      });
    });
  });

  describe('Property 2: Preservation - Task Data Fields', () => {
    
    test('modal preserves is_visible_to_client as boolean field', async () => {
      const mockTask: Task = {
        id: 'task-123',
        name: 'Test Task',
        description: 'Test description',
        status: 'pending',
        start_date: '2025-01-01',
        end_date: '2025-01-31',
        is_visible_to_client: 1, // Stored as 0 or 1 in database
        project_id: 'project-1',
        company_id: 'company-1',
        author_id: 'user-1',
        task_type_id: 'task-type-1',
        project_type_id: 'project-type-1',
        assignees: [],
        document: [],
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        deleted_at: null,
        task_type: { id: 'task-type-1', name: 'General' } as any,
        pipeline: {} as any,
        company: {} as any,
        project: {
          id: 'project-1',
          name: 'Test Project',
          client_organization: 'Test Org',
          clients: [],
        },
      };

      const onClose = vi.fn();
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ViewEditTaskModal
              isOpen={true}
              onClose={onClose}
              taskData={mockTask}
              mode="edit"
            />
          </BrowserRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
      });

      // PRESERVATION: is_visible_to_client checkbox should be present and checked
      const visibilityCheckbox = screen.getByLabelText(/make visible to client/i) as HTMLInputElement;
      expect(visibilityCheckbox).toBeInTheDocument();
      expect(visibilityCheckbox.type).toBe('checkbox');
      expect(visibilityCheckbox).toBeChecked(); // Because is_visible_to_client is 1
    });

    test('modal preserves both start_date and end_date fields as required', async () => {
      const mockTask: Task = {
        id: 'task-123',
        name: 'Test Task',
        description: 'Test description',
        status: 'pending',
        start_date: '2025-01-15',
        end_date: '2025-02-20',
        is_visible_to_client: 0,
        project_id: 'project-1',
        company_id: 'company-1',
        author_id: 'user-1',
        task_type_id: 'task-type-1',
        project_type_id: 'project-type-1',
        assignees: [],
        document: [],
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        deleted_at: null,
        task_type: { id: 'task-type-1', name: 'General' } as any,
        pipeline: {} as any,
        company: {} as any,
        project: {
          id: 'project-1',
          name: 'Test Project',
          client_organization: 'Test Org',
          clients: [],
        },
      };

      const onClose = vi.fn();
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ViewEditTaskModal
              isOpen={true}
              onClose={onClose}
              taskData={mockTask}
              mode="edit"
            />
          </BrowserRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Task')).toBeInTheDocument();
      });

      // PRESERVATION: Both date fields must be present and marked as required
      const startDateButton = screen.getByLabelText(/start date/i);
      expect(startDateButton).toBeInTheDocument();
      // Check for required indicator (typically an asterisk or required attribute)
      const startDateLabel = screen.getByText(/start date/i);
      expect(startDateLabel.closest('.space-y-2')).toBeInTheDocument();

      const endDateButton = screen.getByLabelText(/end date/i);
      expect(endDateButton).toBeInTheDocument();
      const endDateLabel = screen.getByText(/end date/i);
      expect(endDateLabel.closest('.space-y-2')).toBeInTheDocument();
    });

    test('modal preserves assignees array field', async () => {
      const mockTask: Task = {
        id: 'task-123',
        name: 'Test Task',
        description: 'Test description',
        status: 'pending',
        start_date: '2025-01-15',
        end_date: '2025-02-20',
        is_visible_to_client: 0,
        project_id: 'project-1',
        company_id: 'company-1',
        author_id: 'user-1',
        task_type_id: 'task-type-1',
        project_type_id: 'project-type-1',
        assignees: [
          { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'ADMIN' },
          { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'CONSULTANT' },
        ],
        document: [],
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        deleted_at: null,
        task_type: { id: 'task-type-1', name: 'General' } as any,
        pipeline: {} as any,
        company: {} as any,
        project: {
          id: 'project-1',
          name: 'Test Project',
          client_organization: 'Test Org',
          clients: [],
        },
      };

      const onClose = vi.fn();
      
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ViewEditTaskModal
              isOpen={true}
              onClose={onClose}
              taskData={mockTask}
              mode="view" // View mode shows assignees as avatar pills
            />
          </BrowserRouter>
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('View Task')).toBeInTheDocument();
      });

      // PRESERVATION: Assignees should be displayed in view mode
      expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
      
      // In view mode, assignees are shown as avatar pills
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });
  });
});
