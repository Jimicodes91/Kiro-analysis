/**
 * Bug Condition Exploration Test for BUG-1: Non-clickable Project Names
 * 
 * **Validates: Requirements 1.1, 2.1**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the EXPECTED behavior (clickable project names with navigation)
 * It will validate the fix when it passes after implementation
 * 
 * EXPECTED OUTCOME: Test FAILS proving project names are not clickable
 */

import { Task } from '@/types/task.types';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import TaskTableRow from './task-table-row';

/**
 * Property 1: Bug Condition - Project Name Navigation
 * 
 * **Validates: Requirements 1.1, 2.1**
 * 
 * For any task with an associated project, the TaskTableRow component should render
 * the project name as a clickable Link component that navigates to /projects/{projectId}
 * 
 * This property test generates various task data and verifies that:
 * 1. Project name is rendered as a Link element (not plain text)
 * 2. Link has correct href attribute pointing to project details page
 * 3. Project name text is clickable and accessible
 */
describe('TaskTableRow - Bug Condition Exploration: Non-clickable Project Names', () => {
  describe('Property 1: Bug Condition - Project Name Navigation', () => {
    /**
     * Property-based test that explores the bug condition across various inputs
     * 
     * EXPECTED TO FAIL: On unfixed code, this test will fail because:
     * - Project name is rendered as plain text in TableCell, not as a Link
     * - No href attribute exists for navigation
     * - Clicking project name does nothing
     * 
     * This failure is CORRECT and proves the bug exists.
     */
    it('should render project name as clickable link navigating to project details', () => {
      fc.assert(
        fc.property(
          fc.record({
            projectId: fc.uuid(),
            projectName: fc.string({ minLength: 1, maxLength: 100 }).filter(name => name.trim().length > 0),
            taskName: fc.string({ minLength: 1, maxLength: 100 }),
            clientOrganization: fc.string({ minLength: 1, maxLength: 50 }),
            status: fc.constantFrom('completed' as const, 'in_progress' as const, 'pending' as const),
            startDate: fc.integer({ min: 0, max: 3650 }).map(days => {
              const date = new Date('2020-01-01');
              date.setDate(date.getDate() + days);
              return date.toISOString().split('T')[0];
            }),
            endDate: fc.integer({ min: 0, max: 3650 }).map(days => {
              const date = new Date('2020-01-01');
              date.setDate(date.getDate() + days);
              return date.toISOString().split('T')[0];
            }),
          }),
          ({ projectId, projectName, taskName, clientOrganization, status, startDate, endDate }) => {
            // Arrange: Create mock task data
            const mockTask: Task = {
              id: 'task-123',
              created_at: '2025-01-01T00:00:00Z',
              updated_at: '2025-01-01T00:00:00Z',
              deleted_at: null,
              project_id: projectId,
              company_id: 'company-123',
              author_id: 'author-123',
              task_type_id: 'type-123',
              project_type_id: 'proj-type-123',
              name: taskName,
              description: 'Test task description',
              status: status,
              start_date: startDate,
              end_date: endDate,
              is_visible_to_client: 1,
              assignees: [],
              document: [],
              task_type: {
                id: 'type-123',
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z',
                deleted_at: null,
                company_id: 'company-123',
                project_id: null,
                name: 'Standard Task',
                is_system: 1,
                type: 'standard',
                description: 'Standard task type',
              },
              pipeline: {
                id: 'pipeline-123',
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z',
                deleted_at: null,
                company_id: 'company-123',
                name: 'Default Pipeline',
                slug: 'default-pipeline',
                is_system: 1,
              },
              company: {
                id: 'company-123',
                name: 'Test Company',
              },
              project: {
                id: projectId,
                name: projectName,
                client_organization: clientOrganization,
                clients: [],
              },
            };

            // Act: Render the component with BrowserRouter for Link support
            const { container } = render(
              <BrowserRouter>
                <table>
                  <tbody>
                    <TaskTableRow task={mockTask} />
                  </tbody>
                </table>
              </BrowserRouter>
            );

            // Assert: Verify project name is rendered as a clickable link
            // EXPECTED TO PASS on fixed code because project name is now a Link
            
            // 1. Find the link by its href attribute (more reliable than text content)
            const projectLink = container.querySelector(`a[href="/projects/${projectId}"]`);
            expect(projectLink).toBeTruthy();

            // 2. Verify it's an anchor tag (Link component)
            expect(projectLink?.tagName).toBe('A');

            // 3. Verify the link contains the project name text
            expect(projectLink?.textContent?.trim()).toBe(projectName.trim());

            // 4. Verify link has correct styling classes for clickability
            expect(projectLink?.className).toContain('text-blue-600');
            expect(projectLink?.className).toContain('hover:text-blue-800');

            // Cleanup
            container.remove();
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Concrete test case to document the specific counterexample
     * 
     * This test uses the concrete example from the task details:
     * "Immigration Project Alpha" is displayed as plain text without navigation
     */
    it('should fail on concrete example: Immigration Project Alpha is plain text without navigation', () => {
      // Arrange: Create the specific failing case from the bug report
      const mockTask: Task = {
        id: 'task-immigration-001',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        deleted_at: null,
        project_id: 'proj-immigration-alpha',
        company_id: 'company-123',
        author_id: 'author-123',
        task_type_id: 'type-123',
        project_type_id: 'proj-type-123',
        name: 'Document review task',
        description: 'Review immigration documents',
        status: 'in_progress',
        start_date: '2025-01-15',
        end_date: '2025-02-15',
        is_visible_to_client: 1,
        assignees: [],
        document: [],
        task_type: {
          id: 'type-123',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          deleted_at: null,
          company_id: 'company-123',
          project_id: null,
          name: 'Document Review',
          is_system: 1,
          type: 'review',
          description: 'Document review task',
        },
        pipeline: {
          id: 'pipeline-123',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          deleted_at: null,
          company_id: 'company-123',
          name: 'Immigration Pipeline',
          slug: 'immigration-pipeline',
          is_system: 1,
        },
        company: {
          id: 'company-123',
          name: 'Pylott Legal',
        },
        project: {
          id: 'proj-immigration-alpha',
          name: 'Immigration Project Alpha',
          client_organization: 'Global Tech Corp',
          clients: [],
        },
      };

      // Act: Render the component
      render(
        <BrowserRouter>
          <table>
            <tbody>
              <TaskTableRow task={mockTask} />
            </tbody>
          </table>
        </BrowserRouter>
      );

      // Assert: This will FAIL on unfixed code
      // Current behavior: "Immigration Project Alpha" is plain text without Link
      // Expected behavior: Should be a clickable link to /projects/proj-immigration-alpha
      
      const projectName = screen.getByText('Immigration Project Alpha');
      expect(projectName).toBeInTheDocument();
      
      // THESE ASSERTIONS WILL FAIL - proving the bug exists
      expect(projectName.tagName).toBe('A'); // Currently is not an anchor tag
      expect(projectName).toHaveAttribute('href', '/projects/proj-immigration-alpha'); // No href exists
      
      // Document the counterexample: 
      // Project name 'Immigration Project Alpha' in task table is plain text,
      // clicking it does nothing (no navigation occurs)
    });
  });
});
