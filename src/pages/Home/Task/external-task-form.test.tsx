/**
 * Example tests: External Task Form option list & validation
 *
 * Covers:
 * - Req 3.1: all five client task type options are present
 * - Req 3.2: selecting each type shows the corresponding configuration fields
 * - Req 3.5: submission with no type is rejected with a validation message
 * - Req 9.2: submission with no due date is rejected with a validation message
 * - Req 9.3: submission with no assigned client is rejected with a validation message
 *
 * The mutation/query hooks are mocked and the form is wrapped in the required
 * QueryClient + Router providers.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// ── Mocks for the data hooks the form depends on ─────────────────────────────
const mutateAsync = vi.fn().mockResolvedValue({});

vi.mock("@/hooks/project-modules/tasks/use-create-project-task", () => ({
  default: () => ({ mutateAsync, isPending: false }),
}));

// Two selectable client assignees so the multi-picker has options.
vi.mock("@/hooks/project-modules/tasks/use-available-assignees", () => ({
  default: () => ({
    value: [
      { id: "client-1", name: "Alice Client", email: "alice@example.com" },
      { id: "client-2", name: "Bob Client", email: "bob@example.com" },
    ],
    isLoading: false,
  }),
}));

import ExternalTaskForm from "./external-task-form";

// Radix Select relies on a few DOM APIs jsdom does not implement.
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/?projectId=proj-1&projectTypeId=type-1"]}>
        <ExternalTaskForm />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

// Open the task-type Radix select and pick the option with the given visible label.
function selectTaskType(label: string) {
  const trigger = screen.getByRole("combobox");
  fireEvent.click(trigger);
  const option = screen.getByRole("option", { name: label });
  fireEvent.click(option);
}

const FIVE_OPTIONS = [
  "Signing",
  "Provide Information",
  "Document Upload",
  "General Task",
  "Complete Form",
];

describe("ExternalTaskForm — option list (Req 3.1)", () => {
  beforeEach(() => {
    mutateAsync.mockClear();
  });

  it("presents all five client task type options", () => {
    renderForm();

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    FIVE_OPTIONS.forEach((label) => {
      expect(screen.getByRole("option", { name: label })).toBeInTheDocument();
    });
  });
});

describe("ExternalTaskForm — type-specific fields (Req 3.2)", () => {
  beforeEach(() => {
    mutateAsync.mockClear();
  });

  it("shows signing configuration fields when Signing is selected", () => {
    renderForm();
    selectTaskType("Signing");
    expect(screen.getByText("Signing Details")).toBeInTheDocument();
    expect(screen.getByText("Signer name / email")).toBeInTheDocument();
  });

  it("shows information-request fields when Provide Information is selected", () => {
    renderForm();
    selectTaskType("Provide Information");
    expect(screen.getByText("Information Request Details")).toBeInTheDocument();
  });

  it("shows document-upload configuration fields when Document Upload is selected", () => {
    renderForm();
    selectTaskType("Document Upload");
    expect(screen.getByText("Document Upload Configuration")).toBeInTheDocument();
    expect(screen.getByText("Accepted file types")).toBeInTheDocument();
  });

  it("shows the standard (no-extra-fields) section when General Task is selected", () => {
    renderForm();
    selectTaskType("General Task");
    expect(
      screen.getByText("Standard task — no additional fields required")
    ).toBeInTheDocument();
  });

  it("shows no type-specific config placeholder fields when Complete Form is selected", () => {
    renderForm();
    selectTaskType("Complete Form");
    // complete_form is an extensible placeholder — none of the other type
    // sections should be rendered, and no form connection is required.
    expect(screen.queryByText("Signing Details")).not.toBeInTheDocument();
    expect(screen.queryByText("Information Request Details")).not.toBeInTheDocument();
    expect(screen.queryByText("Document Upload Configuration")).not.toBeInTheDocument();
  });
});

describe("ExternalTaskForm — validation (Req 3.5, 9.2, 9.3)", () => {
  beforeEach(() => {
    mutateAsync.mockClear();
  });

  it("rejects submission with no task type selected (Req 3.5)", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => {
      expect(screen.getByText("Task type is required")).toBeInTheDocument();
    });
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("rejects submission with no due date (Req 9.2)", async () => {
    renderForm();

    // Provide a valid type and a client so the due-date error is the one under test.
    selectTaskType("General Task");
    const picker = screen.getByPlaceholderText("Search clients...");
    fireEvent.focus(picker);
    fireEvent.click(screen.getByText("Alice Client"));

    fireEvent.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => {
      expect(screen.getByText("Due date is required")).toBeInTheDocument();
    });
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("rejects submission with no assigned client (Req 9.3)", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Create Task" }));

    // With no client selected the schema surfaces a client validation message
    // (either the "required" or the "at least one" rule).
    await waitFor(() => {
      expect(
        screen.getByText(/clients are required|at least one client is required/i)
      ).toBeInTheDocument();
    });
    expect(mutateAsync).not.toHaveBeenCalled();
  });
});
