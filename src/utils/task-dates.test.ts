import { describe, expect, it } from "vitest";
import { getTaskDueDate } from "./task-dates";

describe("getTaskDueDate", () => {
  it("prefers due_date when both are set", () => {
    expect(
      getTaskDueDate({ due_date: "2026-10-01", end_date: "2026-09-01" })
    ).toBe("2026-10-01");
  });

  it("falls back to end_date for legacy tasks with no due_date", () => {
    expect(getTaskDueDate({ due_date: undefined, end_date: "2026-09-01" })).toBe(
      "2026-09-01"
    );
  });

  it("treats an empty due_date string as missing", () => {
    expect(getTaskDueDate({ due_date: "", end_date: "2026-09-01" })).toBe(
      "2026-09-01"
    );
  });

  it("returns undefined when neither date is set", () => {
    expect(getTaskDueDate({ due_date: undefined, end_date: undefined })).toBeUndefined();
  });

  it("returns undefined for a missing task", () => {
    expect(getTaskDueDate(undefined)).toBeUndefined();
    expect(getTaskDueDate(null)).toBeUndefined();
  });
});
