/**
 * Example tests for the add/edit document-type modal.
 *
 * _Requirements: 1.1, 1.2_
 *
 * (1) The "Requires expiry date?" toggle is present when the modal renders (Req 1.1).
 * (2) In edit mode (a `documentType` with `requires_expiry: true`), the toggle
 *     reflects the seeded value (Req 1.2).
 */

import { DocumentTypeDetails } from '@/types/api.types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/project-modules/document-types/use-create-document-type', () => ({
  default: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

vi.mock('@/hooks/project-modules/document-types/use-update-document-type', () => ({
  default: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

import AddDocumentModal from './add-document-type-model';

const renderModal = (documentType?: DocumentTypeDetails) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AddDocumentModal isOpen onClose={vi.fn()} documentType={documentType} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const makeDocumentType = (
  overrides: Partial<DocumentTypeDetails> = {}
): DocumentTypeDetails => ({
  id: 'doc-type-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  company_id: 'company-1',
  project_id: 'project-1',
  name: 'Passport',
  is_system: 0,
  type: 'identity',
  description: 'A government issued document',
  requires_expiry: true,
  ...overrides,
});

describe('AddDocumentModal', () => {
  beforeEach(() => {
    if (!document.getElementById('modal-root')) {
      const root = document.createElement('div');
      root.setAttribute('id', 'modal-root');
      document.body.appendChild(root);
    }
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the "Requires expiry date?" toggle (Req 1.1)', () => {
    const { getByText, baseElement } = renderModal();

    // Label is rendered.
    expect(getByText('Requires expiry date?')).toBeInTheDocument();

    // The Switch renders as a role="switch" control.
    const toggle = baseElement.querySelector('[role="switch"]');
    expect(toggle).toBeInTheDocument();
  });

  it('defaults the toggle to unchecked in create mode (Req 1.2)', () => {
    const { baseElement } = renderModal();

    const toggle = baseElement.querySelector('[role="switch"]') as HTMLElement;
    expect(toggle).toBeInTheDocument();
    expect(toggle.getAttribute('aria-checked')).toBe('false');
  });

  it('reflects the seeded requires_expiry value in edit mode (Req 1.2)', () => {
    const { baseElement } = renderModal(makeDocumentType({ requires_expiry: true }));

    const toggle = baseElement.querySelector('[role="switch"]') as HTMLElement;
    expect(toggle).toBeInTheDocument();
    expect(toggle.getAttribute('aria-checked')).toBe('true');
  });

  it('reflects a seeded requires_expiry=false value in edit mode (Req 1.2)', () => {
    const { baseElement } = renderModal(makeDocumentType({ requires_expiry: false }));

    const toggle = baseElement.querySelector('[role="switch"]') as HTMLElement;
    expect(toggle).toBeInTheDocument();
    expect(toggle.getAttribute('aria-checked')).toBe('false');
  });
});
