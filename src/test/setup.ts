import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

expect.extend(matchers);

// jsdom does not implement ResizeObserver, which Radix UI primitives (e.g. Switch)
// rely on. Provide a no-op polyfill so those components can render under tests.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// Mock useUpdateTask globally to avoid QueryClientProvider requirement in unit tests
vi.mock('@/hooks/project-modules/tasks/use-update-task', () => ({
  default: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});
