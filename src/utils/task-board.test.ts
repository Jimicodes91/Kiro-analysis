import { TaskDetails } from "@/types/api.types";
import { describe, expect, it } from "vitest";
import { getBoardColumn, groupTasksByColumn } from "./task-board";

const NOW = new Date(2026, 8, 12, 12, 0, 0); // 12 Sep 2026, local time

const task = (over: Partial<TaskDetails> & { id: string }): TaskDetails =>
  ({ name: over.id, status: "pending", ...over }) as TaskDetails;

describe("getBoardColumn", () => {
  it("puts not-started tasks in 'needs action'", () => {
    // The API can return a task that has not been started as pending, sent or draft.
    for (const status of ["pending", "sent", "draft"]) {
      expect(getBoardColumn(task({ id: "t", status: status as any }), NOW)).toBe("needs_action");
    }
  });

  it("puts overdue tasks in 'needs action' too", () => {
    const overdue = task({ id: "t", status: "in_progress", due_date: "2026-09-01T12:00:00" });
    expect(getBoardColumn(overdue, NOW)).toBe("needs_action");
  });

  it("puts in-progress tasks that are not overdue in 'in progress'", () => {
    const t = task({ id: "t", status: "in_progress", due_date: "2026-10-01T12:00:00" });
    expect(getBoardColumn(t, NOW)).toBe("in_progress");
  });

  it("puts completed tasks in 'completed', even when their date has passed", () => {
    const t = task({ id: "t", status: "completed", due_date: "2026-01-01T12:00:00" });
    expect(getBoardColumn(t, NOW)).toBe("completed");
  });

  it("falls back to the legacy end_date when there is no due_date", () => {
    const t = task({ id: "t", status: "pending", end_date: "2026-09-01T12:00:00" });
    // Pending + past legacy date is overdue, which is still 'needs action'.
    expect(getBoardColumn(t, NOW)).toBe("needs_action");
  });
});

describe("groupTasksByColumn", () => {
  it("splits tasks into the three columns and keeps the incoming order inside each", () => {
    const grouped = groupTasksByColumn(
      [
        task({ id: "a", status: "completed" }),
        task({ id: "b", status: "pending" }),
        task({ id: "c", status: "in_progress", due_date: "2026-12-01T12:00:00" }),
        task({ id: "d", status: "pending" }),
        task({ id: "e", status: "completed" }),
      ],
      NOW
    );

    expect(grouped.needs_action.map((t) => t.id)).toEqual(["b", "d"]);
    expect(grouped.in_progress.map((t) => t.id)).toEqual(["c"]);
    expect(grouped.completed.map((t) => t.id)).toEqual(["a", "e"]);
  });

  it("loses no tasks", () => {
    const input = Array.from({ length: 9 }, (_, i) =>
      task({ id: `t${i}`, status: (["pending", "in_progress", "completed"] as const)[i % 3] })
    );
    const g = groupTasksByColumn(input, NOW);
    expect(g.needs_action.length + g.in_progress.length + g.completed.length).toBe(9);
  });

  it("returns three empty columns for no tasks", () => {
    expect(groupTasksByColumn([], NOW)).toEqual({ needs_action: [], in_progress: [], completed: [] });
  });
});
