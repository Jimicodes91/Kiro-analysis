/**
 * What one row of the staff Tasks table does today.
 *
 * Replaces the older "preservation" tests, which described a row from before it was rebuilt
 * (it had a View / Edit / Delete menu and a client-organisation column, and took only a task).
 * The row now takes a list of columns to show and edits tasks in place.
 *
 * The save and delete calls are mocked so each test can check exactly what the row sends.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { updateMutate, deleteMutate } = vi.hoisted(() => ({
  updateMutate: vi.fn(),
  deleteMutate: vi.fn(),
}));

vi.mock("@/hooks/project-modules/tasks/use-update-task", () => ({
  default: () => ({ mutateAsync: updateMutate, isPending: false }),
}));
vi.mock("@/hooks/project-modules/tasks/use-delete-task", () => ({
  default: () => ({ mutateAsync: deleteMutate, isPending: false }),
}));
// The comments panel (shown when a row is expanded) has its own data hooks; it is not under test here.
vi.mock("./task-comments", () => ({
  default: ({ taskId }: { taskId: string }) => <div>comments panel for {taskId}</div>,
}));

import { getDefaultColumns } from "./column-config";
import TaskTableRow, { getStatusRowColor } from "./task-table-row";

// Dates far from today, so a task never flips between "Not started" and "Overdue" as time passes.
const FUTURE = "2999-12-31";
const PAST = "2000-01-01";

const makeTask = (over: Record<string, unknown> = {}) =>
  ({
    id: "task-1",
    name: "Prepare visa documents",
    project_id: "proj-1",
    project: { id: "proj-1", name: "Immigration Alpha" },
    status: "pending",
    due_date: FUTURE,
    created_at: "2024-01-15T10:00:00.000Z",
    assignees: [],
    ...over,
  }) as any;

function renderRow(task: any, visibleColumns: string[]) {
  return render(
    <MemoryRouter>
      <table>
        <tbody>
          <TaskTableRow task={task} visibleColumns={visibleColumns} />
        </tbody>
      </table>
    </MemoryRouter>
  );
}

/** The cells of the first row: [expander, ...one per column, delete]. */
const cellsOf = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("tbody tr")[0].querySelectorAll("td"));

beforeEach(() => {
  updateMutate.mockReset().mockResolvedValue({});
  deleteMutate.mockReset().mockResolvedValue({});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("Task table row: what it shows", () => {
  it("shows the name, the project as a link, the due date and the status", () => {
    renderRow(makeTask(), ["subject", "project", "due_date", "status"]);

    expect(screen.getByText("Prepare visa documents")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Immigration Alpha" })).toHaveAttribute(
      "href",
      "/projects/proj-1"
    );
    expect(screen.getByText(FUTURE)).toBeInTheDocument();
    expect(screen.getByText("Not started")).toBeInTheDocument();
  });

  it("shows one cell per chosen column, in that order, plus the expander and delete cells", () => {
    const { container, unmount } = renderRow(makeTask(), ["status", "subject"]);
    const cells = cellsOf(container);

    expect(cells).toHaveLength(2 + 2);
    expect(within(cells[1]).getByText("Not started")).toBeInTheDocument(); // first chosen column
    expect(within(cells[2]).getByText("Prepare visa documents")).toBeInTheDocument(); // second
    expect(screen.queryByText("Immigration Alpha")).not.toBeInTheDocument(); // project was not chosen
    unmount();

    // The default column set the page opens with works the same way.
    const defaults = getDefaultColumns();
    const { container: defaultContainer } = renderRow(makeTask(), defaults);
    expect(cellsOf(defaultContainer)).toHaveLength(defaults.length + 2);
  });

  it("shows a dash where the project, contact or due date is missing", () => {
    const { container } = renderRow(
      makeTask({ project: undefined, contact: null, due_date: undefined, end_date: undefined }),
      ["project", "contact_person", "due_date"]
    );
    const cells = cellsOf(container);
    expect(cells[1]).toHaveTextContent("—");
    expect(cells[2]).toHaveTextContent("—");
    expect(cells[3]).toHaveTextContent("—");
  });

  it.each([
    ["pending", FUTURE, "Not started"],
    ["sent", FUTURE, "Not started"],
    ["in_progress", FUTURE, "In Progress"],
    ["pending", PAST, "Overdue"],
    ["in_progress", PAST, "Overdue"],
    ["completed", PAST, "Completed"],
  ])("a %s task due %s is labelled %s", (status, due_date, label) => {
    renderRow(makeTask({ status, due_date }), ["status"]);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("tints in-progress, completed and archived rows, and leaves other rows plain", () => {
    expect(getStatusRowColor("in_progress")).toBe("bg-amber-50");
    expect(getStatusRowColor("completed")).toBe("bg-green-50");
    expect(getStatusRowColor("archived")).toBe("bg-slate-100");
    expect(getStatusRowColor("pending")).toBe("");
  });
});

describe("Task table row: editing the name", () => {
  it("click the name, type a new one, press Enter, and it saves", () => {
    renderRow(makeTask(), ["subject"]);

    fireEvent.click(screen.getByText("Prepare visa documents"));
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("Prepare visa documents");

    fireEvent.change(input, { target: { value: "  Collect passports  " } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(updateMutate).toHaveBeenCalledTimes(1);
    expect(updateMutate).toHaveBeenCalledWith({ name: "Collect passports" }); // trimmed
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument(); // back to plain text
  });

  it("does not save when the name is unchanged, blank, or cancelled with Escape", () => {
    renderRow(makeTask(), ["subject"]);

    // Unchanged
    fireEvent.click(screen.getByText("Prepare visa documents"));
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });

    // Blank
    fireEvent.click(screen.getByText("Prepare visa documents"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "   " } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });

    // Escape after typing
    fireEvent.click(screen.getByText("Prepare visa documents"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Something else" } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });

    expect(updateMutate).not.toHaveBeenCalled();
    expect(screen.getByText("Prepare visa documents")).toBeInTheDocument(); // original name still shown
  });
});

describe("Task table row: completing and deleting", () => {
  it("the Done circle completes an open task, and reopens a completed one as a draft", () => {
    const { container, unmount } = renderRow(makeTask({ status: "pending" }), ["done", "subject"]);
    fireEvent.click(cellsOf(container)[1]);
    expect(updateMutate).toHaveBeenLastCalledWith({ status: "completed" });
    unmount();

    const { container: doneContainer } = renderRow(makeTask({ status: "completed" }), ["done", "subject"]);
    fireEvent.click(cellsOf(doneContainer)[1]);
    expect(updateMutate).toHaveBeenLastCalledWith({ status: "draft" });
  });

  it("the tick next to the status completes the task, and is not offered once it is completed", () => {
    const { unmount } = renderRow(makeTask({ status: "in_progress" }), ["status"]);
    fireEvent.click(screen.getByTitle("Mark as completed"));
    expect(updateMutate).toHaveBeenCalledWith({ status: "completed" });
    unmount();

    renderRow(makeTask({ status: "completed" }), ["status"]);
    expect(screen.queryByTitle("Mark as completed")).not.toBeInTheDocument();
  });

  it("delete asks first: Cancel does nothing, OK deletes", () => {
    const confirmSpy = vi.spyOn(window, "confirm");
    renderRow(makeTask(), ["subject"]);

    confirmSpy.mockReturnValue(false);
    fireEvent.click(screen.getByTitle("Delete task"));
    expect(confirmSpy).toHaveBeenCalledWith("Delete this task?");
    expect(deleteMutate).not.toHaveBeenCalled();

    confirmSpy.mockReturnValue(true);
    fireEvent.click(screen.getByTitle("Delete task"));
    expect(deleteMutate).toHaveBeenCalledTimes(1);
  });
});

describe("Task table row: expanding", () => {
  it("clicking the first cell shows the comments for that task, and clicking again hides them", () => {
    const { container } = renderRow(makeTask(), ["subject"]);
    expect(screen.queryByText(/comments panel/)).not.toBeInTheDocument();

    fireEvent.click(cellsOf(container)[0]);
    expect(screen.getByText("comments panel for task-1")).toBeInTheDocument();

    fireEvent.click(cellsOf(container)[0]);
    expect(screen.queryByText(/comments panel/)).not.toBeInTheDocument();
  });
});
