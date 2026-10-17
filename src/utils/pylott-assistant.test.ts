import { IDocument, TaskDetails } from "@/types/api.types";
import { describe, expect, it } from "vitest";
import {
    PYLOTT_SUGGESTIONS,
    PylottData,
    answerQuestion,
    detectIntent,
} from "./pylott-assistant";

const NOW = new Date("2026-09-12T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;

/** ISO date `n` days from the real today (document expiry uses the real clock). */
const fromToday = (n: number) => new Date(Date.now() + n * DAY).toISOString();

const task = (over: Partial<TaskDetails> & { id: string; name: string }): TaskDetails =>
  ({ status: "pending", ...over }) as TaskDetails;

const doc = (over: Partial<IDocument> & { id: string; name: string }): IDocument =>
  ({ attachments: [{ id: "a1", media_url: "https://x/y.pdf" }], ...over }) as IDocument;

const data = (over: Partial<PylottData> = {}): PylottData => ({
  projectId: "p1",
  tasks: [],
  documents: [],
  stage: null,
  projectEndDate: null,
  ...over,
});

describe("detectIntent", () => {
  it("routes every suggestion chip to a real intent", () => {
    expect(detectIntent(PYLOTT_SUGGESTIONS[0])).toBe("tasks");
    expect(detectIntent(PYLOTT_SUGGESTIONS[1])).toBe("stage");
    expect(detectIntent(PYLOTT_SUGGESTIONS[2])).toBe("completion");
    expect(detectIntent(PYLOTT_SUGGESTIONS[3])).toBe("docs_needed");
  });

  it.each([
    ["What tasks are overdue?", "overdue"],
    ["Which documents are expiring?", "docs_expiry"],
    ["Are any of my documents expired?", "docs_expiry"],
    ["How many documents do I have?", "docs_count"],
    ["When is my next task due?", "due"],
    ["What's the status of my project?", "stage"],
    ["hello", "help"],
    ["thanks", "thanks"],
    ["", "help"],
    ["what is the weather like", "unknown"],
  ])("%s -> %s", (question, intent) => {
    expect(detectIntent(question)).toBe(intent);
  });
});

describe("tasks", () => {
  it("lists open tasks soonest-due first, undated last, skipping completed", () => {
    const answer = answerQuestion(
      "What do I need to do next?",
      data({
        tasks: [
          task({ id: "t3", name: "No date" }),
          task({ id: "t2", name: "Later", due_date: "2026-10-20" }),
          task({ id: "t1", name: "Sooner", due_date: "2026-09-20" }),
          task({ id: "t4", name: "Done", status: "completed", due_date: "2026-09-01" }),
        ],
      }),
      NOW
    );

    expect(answer.text).toContain("3 tasks");
    expect(answer.items?.map((i) => i.text.split(" (")[0])).toEqual([
      "Sooner",
      "Later",
      "No date",
    ]);
    expect(answer.items?.[0].to).toBe("/tasks/p1/t1");
  });

  it("uses the legacy end_date when due_date is missing", () => {
    const answer = answerQuestion(
      "what do i need to do",
      data({
        // No "Z": parsed as local time, so the test passes in any timezone.
        tasks: [task({ id: "t1", name: "Legacy", end_date: "2026-09-25T12:00:00" })],
      }),
      NOW
    );
    expect(answer.items?.[0].text).toContain("25 Sep 2026");
  });

  it("says the client is caught up when nothing is open", () => {
    const answer = answerQuestion("what next", data({ tasks: [] }), NOW);
    expect(answer.text).toMatch(/all caught up/i);
    expect(answer.items).toBeUndefined();
  });

  it("caps the list and says how it was trimmed", () => {
    const tasks = Array.from({ length: 8 }, (_, i) =>
      task({ id: `t${i}`, name: `Task ${i}`, due_date: `2026-10-0${i + 1}` })
    );
    const answer = answerQuestion("what tasks do I have", data({ tasks }), NOW);
    expect(answer.items).toHaveLength(5);
    expect(answer.text).toContain("8 tasks");
    expect(answer.text).toContain("5 most urgent");
  });
});

describe("overdue", () => {
  it("returns only open tasks past their due date", () => {
    const answer = answerQuestion(
      "what is overdue",
      data({
        tasks: [
          task({ id: "t1", name: "Late one", due_date: "2026-09-01" }),
          task({ id: "t2", name: "Future", due_date: "2026-10-01" }),
          task({ id: "t3", name: "Late but done", status: "completed", due_date: "2026-09-01" }),
        ],
      }),
      NOW
    );
    expect(answer.items).toHaveLength(1);
    expect(answer.items?.[0].text).toContain("Late one");
    expect(answer.items?.[0].text).toContain("overdue");
  });

  it("says so when nothing is overdue", () => {
    const answer = answerQuestion(
      "anything overdue?",
      data({ tasks: [task({ id: "t1", name: "Fine", due_date: "2026-12-01" })] }),
      NOW
    );
    expect(answer.text).toMatch(/none of your tasks are overdue/i);
  });
});

describe("documents", () => {
  it("counts only documents that have a file", () => {
    const answer = answerQuestion(
      "how many documents do I have",
      data({
        documents: [
          doc({ id: "d1", name: "Passport" }),
          doc({ id: "d2", name: "Placeholder", attachments: [] }),
        ],
      })
    );
    expect(answer.text).toContain("1 document on file");
    expect(answer.text).toContain("1 other record");
  });

  it("flags expired and expiring documents, most urgent first", () => {
    const answer = answerQuestion(
      "which documents are expiring",
      data({
        documents: [
          doc({ id: "d1", name: "Soon", expiry_date: fromToday(10) }),
          doc({ id: "d2", name: "Gone", expiry_date: fromToday(-5) }),
          doc({ id: "d3", name: "Fine", expiry_date: fromToday(300) }),
          doc({ id: "d4", name: "Forever", does_not_expire: true }),
        ],
      })
    );
    expect(answer.items?.map((i) => i.text.split(":")[0])).toEqual(["Gone", "Soon"]);
  });

  it("does not call a document valid when it has no expiry information", () => {
    const answer = answerQuestion(
      "are my documents expiring",
      data({ documents: [doc({ id: "d1", name: "Mystery" })] })
    );
    expect(answer.text).toContain("no expiry date recorded");
    expect(answer.text).toContain("can't tell");
  });

  it("only reports task-based requests as outstanding, and says so", () => {
    const answer = answerQuestion(
      "which documents are still outstanding",
      data({
        tasks: [
          task({ id: "t1", name: "Upload passport", task_category_type: "document_upload" }),
          task({ id: "t2", name: "Sign form", task_category_type: "signing" }),
        ],
      }),
      NOW
    );
    expect(answer.items).toHaveLength(1);
    expect(answer.items?.[0].text).toContain("Upload passport");
    expect(answer.text).toContain("only covers documents your team has asked for");
  });

  it("admits it cannot see a full required-documents list", () => {
    const answer = answerQuestion("what documents am I missing", data({ tasks: [] }), NOW);
    expect(answer.text).toMatch(/can't see a full list/i);
  });
});

describe("stage and completion", () => {
  const stage = {
    name: "Document Review",
    index: 2,
    total: 5,
    // Local-time constructors keep these stable regardless of the machine's timezone.
    startDate: new Date(2026, 8, 12),
    endDate: new Date(2026, 8, 28),
  };

  it("describes the current stage with dates", () => {
    const answer = answerQuestion("what stage am I at", data({ stage }));
    expect(answer.text).toContain("stage 3 of 5: Document Review");
    expect(answer.text).toContain("12 Sep 2026");
    expect(answer.text).toContain("estimated");
  });

  it("calls the finish date an estimate", () => {
    const answer = answerQuestion(
      "when will it finish",
      data({ stage, projectEndDate: new Date(2026, 9, 3) })
    );
    expect(answer.text).toContain("3 Oct 2026");
    expect(answer.text).toMatch(/estimate/i);
  });

  it("refuses to guess a finish date it does not have", () => {
    const answer = answerQuestion("when will it finish", data({ projectEndDate: null }));
    expect(answer.text).toMatch(/can't estimate/i);
  });
});

describe("unavailable data and unknown questions", () => {
  it("does not say 'none' when the tasks failed to load", () => {
    const answer = answerQuestion("what do I need to do next", data({ tasks: null }), NOW);
    expect(answer.text).toMatch(/can't see your tasks/i);
    expect(answer.text).not.toMatch(/caught up/i);
  });

  it("does not say 'none' when documents failed to load", () => {
    const answer = answerQuestion("how many documents", data({ documents: null }));
    expect(answer.text).toMatch(/can't see your documents/i);
  });

  it("says the team hasn't shared tasks, instead of implying an error", () => {
    const answer = answerQuestion(
      "what do I need to do next",
      data({ tasks: null, hidden: { tasks: true } }),
      NOW
    );
    expect(answer.text).toMatch(/hasn't shared your tasks/i);
    expect(answer.text).not.toMatch(/try again/i);
  });

  it("says the team hasn't shared documents, instead of implying an error", () => {
    const answer = answerQuestion(
      "how many documents do I have",
      data({ documents: null, hidden: { documents: true } })
    );
    expect(answer.text).toMatch(/hasn't shared your documents/i);
  });

  it("admits when it cannot answer", () => {
    const answer = answerQuestion("can you book me a flight", data());
    expect(answer.text).toMatch(/can't answer that/i);
    expect(answer.suggestions?.length).toBeGreaterThan(0);
  });
});
