// Feature: client-documents-tasks, Property 6
/**
 * Property 6: Document-type expiry-config propagation
 *
 * **Validates: Requirements 1.3, 1.4, 1.5**
 *
 * For any boolean value of the "Requires expiry date?" toggle, the submitted
 * create/update mutation payload's `requires_expiry` must equal the toggle
 * value (propagated unchanged). We drive this by rendering the real modal,
 * flipping the toggle to the generated value, filling the required fields, and
 * submitting — then asserting the captured mutation payload.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, vi } from 'vitest';

// Shared spy so both create and update hooks record their submitted payloads.
const mutateAsyncSpy = vi.fn().mockResolvedValue({});

vi.mock('@/hooks/project-modules/document-types/use-create-document-type', () => ({
  default: () => ({
    mutateAsync: mutateAsyncSpy,
    isPending: false,
    isError: false,
    error: null,
  }),
}));

vi.mock('@/hooks/project-modules/document-types/use-update-document-type', () => ({
  default: () => ({
    mutateAsync: mutateAsyncSpy,
    isPending: false,
    isError: false,
    error: null,
  }),
}));

import AddDocumentModal from './add-document-type-model';

const renderModal = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AddDocumentModal isOpen onClose={vi.fn()} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Property 6: Document-type expiry-config propagation', () => {
  beforeEach(() => {
    // Modal renders into a portal target that must exist in the DOM.
    if (!document.getElementById('modal-root')) {
      const root = document.createElement('div');
      root.setAttribute('id', 'modal-root');
      document.body.appendChild(root);
    }
  });

  afterEach(() => {
    cleanup();
    mutateAsyncSpy.mockClear();
  });

  it('propagates the toggle value into the submitted payload for all boolean inputs', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (toggleValue) => {
        mutateAsyncSpy.mockClear();
        // The modal renders into a portal (#modal-root), so query `baseElement`
        // (the whole document body) rather than `container`.
        const { baseElement, getByPlaceholderText, unmount } = renderModal();

        // Fill required fields so Yup validation passes and submit fires.
        fireEvent.change(getByPlaceholderText('Type name'), {
          target: { value: 'Passport' },
        });
        fireEvent.change(getByPlaceholderText('Description'), {
          target: { value: 'A government issued document' },
        });

        // The Radix Switch renders as role="switch" with aria-checked.
        const toggle = baseElement.querySelector('[role="switch"]') as HTMLElement;
        expect(toggle).toBeTruthy();

        const isChecked = toggle.getAttribute('aria-checked') === 'true';
        // Default seeded value is false; only click when we need it to differ.
        if (isChecked !== toggleValue) {
          fireEvent.click(toggle);
        }

        const form = baseElement.querySelector('form') as HTMLFormElement;
        fireEvent.submit(form);

        await waitFor(() => {
          expect(mutateAsyncSpy).toHaveBeenCalledTimes(1);
        });

        const payload = mutateAsyncSpy.mock.calls[0][0];
        expect(payload.requires_expiry).toBe(toggleValue);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
