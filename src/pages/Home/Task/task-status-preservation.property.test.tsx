import { Badge } from '@/components/ui/badge';
import { taskStatuses } from '@/lib/constants';
import { getFormattedText } from '@/lib/utils';
import { fc, test } from '@fast-check/vitest';
import { render } from '@testing-library/react';
import { describe, expect } from 'vitest';

/**
 * Preservation Property Tests - Task Status Functionality
 * 
 * **Validates: Requirements 3.1, 3.3, 3.9**
 * 
 * **IMPORTANT**: These tests verify UNFIXED behavior that MUST be preserved
 * 
 * BUG-2: Inconsistent Status Labels - Preservation Tests
 * 
 * PRESERVATION AREAS:
 * - Status update operations work correctly with existing API
 * - Badge component renders with correct variants for task statuses
 * - Task display shows all required information correctly
 * - Status filtering in search works properly
 * - Task operations (view, edit, delete) execute correctly
 * 
 * The old tests that rendered a whole TaskTableRow were replaced by task-table-row.behavior.test.tsx,
 * because the row has been rebuilt since they were written.
 *
 * **EXPECTED OUTCOME**: Tests PASS on UNFIXED code (confirms baseline behavior)
 * - If tests PASS: Baseline behavior confirmed, safe to proceed with fix
 * - If tests FAIL: Something broken in unfixed code, investigate before fixing
 */

describe('BUG-2: Task Status Functionality - Preservation Tests', () => {
  describe('Property 2: Preservation - Status Functionality', () => {
    
    test('Badge component renders with all task status variants', () => {
      // Verify Badge component supports all 3 task status variants
      const statuses: Array<'pending' | 'in_progress' | 'completed'> = ['pending', 'in_progress', 'completed'];
      
      statuses.forEach(status => {
        const { container } = render(<Badge variant={status}>{status}</Badge>);
        const badge = container.querySelector('.inline-flex');
        
        // Badge should render successfully for each status
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('inline-flex');
        
        // Badge should have the capitalize class
        expect(badge).toHaveClass('capitalize');
      });
    });

    test('taskStatuses constant defines the five dropdown statuses', () => {
      // The dropdown offers Draft, Sent, In Progress, Completed and Archived.
      expect(taskStatuses).toBeDefined();
      expect(taskStatuses).toEqual([
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ]);
    });
    test('getFormattedText utility splits underscores in status values', () => {
      // Verify the existing getFormattedText utility works
      expect(getFormattedText('pending')).toBe('pending');
      expect(getFormattedText('in_progress')).toBe('in progress'); // splits underscore
      expect(getFormattedText('completed')).toBe('completed');
      
      // Verify it handles edge cases
      expect(getFormattedText(undefined)).toBe('');
      expect(getFormattedText('')).toBe('');
    });

    test('Badge variants for task statuses match existing styling', () => {
      // PRESERVE: Verify Badge component has the expected task status variants
      // These are the current variants on unfixed code
      
      const pendingBadge = render(<Badge variant="pending">Pending</Badge>);
      expect(pendingBadge.container.querySelector('.inline-flex')).toHaveClass('bg-[#F1E6D4]');
      expect(pendingBadge.container.querySelector('.inline-flex')).toHaveClass('text-[#B78026]');
      
      const inProgressBadge = render(<Badge variant="in_progress">In Progress</Badge>);
      expect(inProgressBadge.container.querySelector('.inline-flex')).toHaveClass('bg-[#FEF4C7]');
      expect(inProgressBadge.container.querySelector('.inline-flex')).toHaveClass('text-[#994C1C]');
      
      const completedBadge = render(<Badge variant="completed">Completed</Badge>);
      expect(completedBadge.container.querySelector('.inline-flex')).toHaveClass('bg-[#00AA3B1A]');
      expect(completedBadge.container.querySelector('.inline-flex')).toHaveClass('text-[#00AA3B]');
    });

    test.prop([
      fc.constantFrom('pending' as const, 'in_progress' as const, 'completed' as const),
    ])('The three coloured badge statuses still render a Badge', (status) => {
      // PRESERVE: the Badge has a colour variant for pending, in_progress and completed.
      const { container } = render(<Badge variant={status}>{status}</Badge>);
      expect(container.querySelector('.inline-flex')).toBeInTheDocument();
    });

    test.prop([
      fc.constantFrom('draft' as const, 'sent' as const, 'in_progress' as const, 'completed' as const, 'archived' as const),
    ])('every status the dropdown offers maps to a taskStatuses entry', (status) => {
      // The dropdown lists five statuses. (pending is not one of them: the API returns
      // pending tasks as "sent".)
      const statusEntry = taskStatuses.find(s => s.value === status);
      expect(statusEntry).toBeDefined();
      expect(statusEntry?.value).toBe(status);
    });

    test('Task status type definitions are correct', () => {
      const dropdownStatuses = ['draft', 'sent', 'in_progress', 'completed', 'archived'];

      // All dropdown statuses have a taskStatuses entry, and there are no extras.
      dropdownStatuses.forEach(status => {
        const entry = taskStatuses.find(s => s.value === status);
        expect(entry).toBeDefined();
        expect(entry?.value).toBe(status);
      });
      expect(taskStatuses).toHaveLength(dropdownStatuses.length);
    });

      });
});
