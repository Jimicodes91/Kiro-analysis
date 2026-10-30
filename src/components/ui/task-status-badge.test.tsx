import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TaskStatusBadge } from "./task-status-badge";

afterEach(() => cleanup());

const days = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();

describe("TaskStatusBadge on the admin Tasks table (a due date is passed)", () => {
  it("shows an unstarted task as grey 'Not started'", () => {
    render(<TaskStatusBadge status="sent" dueDate={days(10)} />);
    const badge = screen.getByText("Not started");
    expect(badge.className).toMatch(/bg-gray-100/);
  });

  it("shows an in-progress task as 'In Progress', not 'Not started'", () => {
    render(<TaskStatusBadge status="in_progress" dueDate={days(10)} />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.queryByText("Not started")).not.toBeInTheDocument();
  });

  it("shows a task past its due date as red 'Overdue'", () => {
    render(<TaskStatusBadge status="pending" dueDate={days(-10)} />);
    expect(screen.getByText("Overdue").className).toMatch(/bg-red-100/);
  });

  it("shows an in-progress task past its due date as 'Overdue' too", () => {
    render(<TaskStatusBadge status="in_progress" dueDate={days(-10)} />);
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("shows a completed task as 'Completed', even when its date has passed", () => {
    render(<TaskStatusBadge status="completed" dueDate={days(-10)} />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("with no due date, an unstarted task is 'Not started' and an in-progress one 'In Progress'", () => {
    const { rerender } = render(<TaskStatusBadge status="pending" dueDate={null} />);
    expect(screen.getByText("Not started")).toBeInTheDocument();
    rerender(<TaskStatusBadge status="in_progress" dueDate={null} />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });
});
