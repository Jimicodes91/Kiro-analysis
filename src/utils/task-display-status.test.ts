import { describe, expect, it } from "vitest";
import {
  getDisplayedStatus,
  getDisplayedStatusBadgeVariant,
} from "./task-display-status";

const NOW = new Date(2026, 8, 12, 12, 0, 0); // 12 Sep 2026, local time
const PAST = "2026-09-01T12:00:00";
const FUTURE = "2026-10-01T12:00:00";

describe("the colour a task status gets", () => {
  it("Overdue is red", () => {
    const status = getDisplayedStatus("pending", PAST, NOW);
    expect(status).toBe("Overdue");
    expect(getDisplayedStatusBadgeVariant(status)).toBe("destructive");
  });

  it("Not started is grey", () => {
    const status = getDisplayedStatus("pending", FUTURE, NOW);
    expect(status).toBe("Not started");
    expect(getDisplayedStatusBadgeVariant(status)).toBe("todo");
  });

  it("In Progress is amber and Completed is green", () => {
    expect(getDisplayedStatusBadgeVariant("In Progress")).toBe("in_progress");
    expect(getDisplayedStatusBadgeVariant("Completed")).toBe("completed");
  });
});

describe("what counts as Not started", () => {
  it.each(["pending", "sent", "draft"])(
    "%s is Not started (the API can return an unstarted task as any of these)",
    (status) => {
      expect(getDisplayedStatus(status, FUTURE, NOW)).toBe("Not started");
    }
  );

  it("a task with no due date is Not started, never Overdue", () => {
    expect(getDisplayedStatus("pending", undefined, NOW)).toBe("Not started");
    expect(getDisplayedStatus("sent", null, NOW)).toBe("Not started");
  });

  it("an unstarted task past its due date is Overdue, not Not started", () => {
    expect(getDisplayedStatus("sent", PAST, NOW)).toBe("Overdue");
  });

  it("an in-progress task past its due date is Overdue", () => {
    expect(getDisplayedStatus("in_progress", PAST, NOW)).toBe("Overdue");
  });

  it("a completed task is never Overdue, even long past its date", () => {
    expect(getDisplayedStatus("completed", PAST, NOW)).toBe("Completed");
  });
});
