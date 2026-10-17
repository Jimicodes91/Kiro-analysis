import { IDocument, TaskDetails } from "@/types/api.types";
import { getDocumentExpiryInfo } from "@/utils/document-expiry";
import { getTaskDueDate } from "@/utils/task-dates";
import { getDisplayedStatus } from "@/utils/task-display-status";
import { format } from "date-fns";

/**
 * Ask Pylott: a rule-based project assistant.
 *
 * There is no AI model and no network call. A question is matched to an intent
 * with keyword rules, then answered from the project data the client's pages
 * already load (tasks, documents, stages). That means:
 *  - nothing leaves the app, so there is no third-party data sharing;
 *  - answers are computed, never invented;
 *  - when data is missing or unavailable, the answer says so instead of guessing.
 *
 * Everything here is pure (no React, no fetching) so it is easy to test, and the
 * single entry point `answerQuestion` can later be swapped for an LLM-backed
 * implementation without touching the UI.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface PylottStage {
  name: string;
  /** Zero-based position of the current stage. */
  index: number;
  total: number;
  startDate: Date | null;
  endDate: Date | null;
}

/**
 * The project facts Pylott may use. `null` means "not available" (still
 * loading, failed to load, or hidden from the client), which is different from
 * an empty list ("loaded, and there are none").
 */
export interface PylottData {
  projectId: string;
  tasks: TaskDetails[] | null;
  documents: IDocument[] | null;
  stage: PylottStage | null;
  /** Estimated end of the final stage, or null if it can't be worked out. */
  projectEndDate: Date | null;
  /** Areas the team has chosen not to share with this client. */
  hidden?: { tasks?: boolean; documents?: boolean };
}

export interface PylottItem {
  text: string;
  /** In-app route this item links to. */
  to?: string;
}

export interface PylottAction {
  label: string;
  to: string;
}

export interface PylottAnswer {
  text: string;
  items?: PylottItem[];
  actions?: PylottAction[];
  /** Follow-up questions the user can tap. */
  suggestions?: string[];
}

export type PylottIntent =
  | "help"
  | "thanks"
  | "overdue"
  | "docs_expiry"
  | "docs_count"
  | "docs_needed"
  | "docs_summary"
  | "due"
  | "stage"
  | "completion"
  | "tasks"
  | "unknown";

export const PYLOTT_SUGGESTIONS = [
  "What do I need to do next?",
  "What stage is my project at?",
  "When is my project estimated to finish?",
  "Which documents are still outstanding?",
];

/** How many list items to show before pointing the user to the full page. */
const MAX_ITEMS = 5;

// ── Intent detection ─────────────────────────────────────────────────────────

const R = {
  help: /^(hi|hello|hey|help|what can you do|what can i ask|who are you)\b/,
  thanks: /^(thanks|thank you|cheers)\b/,
  overdue: /\b(overdue|late|behind|past due|missed)\b/,
  doc: /\b(documents?|docs?|files?|passport|certificates?|paperwork|uploads?|uploaded)\b/,
  expiry: /\b(expir\w*|renew\w*|valid)\b/,
  count: /\b(how many|count|total|number of)\b/,
  needed: /\b(need\w*|missing|required|outstanding|still|provide|submit|upload|owe)\b/,
  due: /\bdue\b/,
  stageWord: /\b(stage|milestone|phase|where am i|where are we|status|progress)\b/,
  taskWord: /\btasks?\b/,
  completionStrong: /\b(estimated|eta|completion|deadline|how long)\b/,
  completionWord: /\b(finish\w*|complet\w*|done|end|ends)\b/,
  when: /\bwhen\b/,
  todo: /\b(next|to do|todo|actions?|outstanding|pending|waiting|what do i need)\b/,
};

function normalize(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Work out what the user is asking about. Order matters: more specific topics
 * (overdue, documents) are checked before broad ones (tasks).
 */
export function detectIntent(question: string): PylottIntent {
  const q = normalize(question);
  if (!q) return "help";

  const wordCount = q.split(" ").length;
  if (wordCount <= 5 && R.help.test(q)) return "help";
  if (wordCount <= 4 && R.thanks.test(q)) return "thanks";

  const mentionsTasks = R.taskWord.test(q);

  if (R.overdue.test(q)) return "overdue";

  if (R.doc.test(q) && !mentionsTasks) {
    if (R.expiry.test(q)) return "docs_expiry";
    if (R.count.test(q)) return "docs_count";
    if (R.needed.test(q)) return "docs_needed";
    return "docs_summary";
  }

  if (R.due.test(q) && !R.stageWord.test(q)) return "due";

  if (R.stageWord.test(q) && !mentionsTasks) return "stage";

  if (
    !mentionsTasks &&
    (R.completionStrong.test(q) || (R.when.test(q) && R.completionWord.test(q)))
  ) {
    return "completion";
  }

  if (R.todo.test(q) || mentionsTasks) return "tasks";

  return "unknown";
}

// ── Small helpers ────────────────────────────────────────────────────────────

function formatDate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? null : format(date, "d MMM yyyy");
}

function plural(count: number, one: string, many = `${one}s`): string {
  return count === 1 ? one : many;
}

function dueTime(task: TaskDetails): number | null {
  const due = getTaskDueDate(task);
  if (!due) return null;
  const time = new Date(due).getTime();
  return Number.isNaN(time) ? null : time;
}

/** Soonest due date first; tasks with no due date go last. */
function byUrgency(a: TaskDetails, b: TaskDetails): number {
  const ta = dueTime(a);
  const tb = dueTime(b);
  if (ta === null && tb === null) return 0;
  if (ta === null) return 1;
  if (tb === null) return -1;
  return ta - tb;
}

function describeTask(task: TaskDetails, projectId: string, now: Date): PylottItem {
  const due = getTaskDueDate(task);
  const dueText = formatDate(due);

  let suffix = " (no due date)";
  if (dueText) {
    suffix =
      getDisplayedStatus(task.status, due, now) === "Overdue"
        ? ` (overdue, was due ${dueText})`
        : ` (due ${dueText})`;
  }

  return {
    text: `${task.name || "Untitled task"}${suffix}`,
    to: `/tasks/${projectId}/${task.id}`,
  };
}

function openTasks(tasks: TaskDetails[]): TaskDetails[] {
  return tasks.filter((task) => task.status !== "completed");
}

/** Documents that actually have a file. Task placeholders without one are excluded. */
function documentsWithFiles(documents: IDocument[]): IDocument[] {
  return documents.filter((doc) => (doc.attachments?.length ?? 0) > 0);
}

function unavailable(
  what: "tasks" | "documents" | "stage",
  data: PylottData
): PylottAnswer {
  // The team chose not to share this area: say that, rather than imply an error.
  if (what !== "stage" && data.hidden?.[what]) {
    return {
      text: `Your team hasn't shared your ${what} on this project, so I can't answer questions about them.`,
    };
  }

  const route = what === "tasks" ? "/tasks" : what === "documents" ? "/documents" : "/journey";
  const label = what === "tasks" ? "Open tasks" : what === "documents" ? "Open documents" : "Open journey";
  const noun = what === "stage" ? "your project stage" : `your ${what}`;
  return {
    text: `I can't see ${noun} right now. Please try again in a moment, or check the page directly.`,
    actions: [{ label, to: route }],
  };
}

// ── Answers ──────────────────────────────────────────────────────────────────

function answerHelp(): PylottAnswer {
  return {
    text: "I'm Pylott. I can answer questions about your project using your tasks, documents and project stages. Try one of these:",
    suggestions: PYLOTT_SUGGESTIONS,
  };
}

function answerThanks(): PylottAnswer {
  return {
    text: "You're welcome. Ask me anything else about your project.",
    suggestions: PYLOTT_SUGGESTIONS,
  };
}

function answerUnknown(): PylottAnswer {
  return {
    text: "I can't answer that one yet. I only know about your tasks, documents and project stages. For anything else, please contact your consultant.",
    suggestions: PYLOTT_SUGGESTIONS,
  };
}

function taskList(
  tasks: TaskDetails[],
  projectId: string,
  now: Date,
  lead: (total: number) => string
): PylottAnswer {
  const sorted = [...tasks].sort(byUrgency);
  const shown = sorted.slice(0, MAX_ITEMS);
  const more = sorted.length - shown.length;

  return {
    text:
      more > 0
        ? `${lead(sorted.length)} Here are the ${shown.length} most urgent:`
        : `${lead(sorted.length)}`,
    items: shown.map((task) => describeTask(task, projectId, now)),
    actions: [{ label: "View all tasks", to: "/tasks" }],
  };
}

function answerTasks(data: PylottData, now: Date): PylottAnswer {
  if (!data.tasks) return unavailable("tasks", data);

  const open = openTasks(data.tasks);
  if (open.length === 0) {
    return {
      text: "You're all caught up. There's nothing waiting on you right now.",
      actions: [{ label: "View tasks", to: "/tasks" }],
    };
  }

  return taskList(
    open,
    data.projectId,
    now,
    (total) => `You have ${total} ${plural(total, "task")} waiting on you.`
  );
}

function answerOverdue(data: PylottData, now: Date): PylottAnswer {
  if (!data.tasks) return unavailable("tasks", data);

  const overdue = openTasks(data.tasks).filter(
    (task) => getDisplayedStatus(task.status, getTaskDueDate(task), now) === "Overdue"
  );

  if (overdue.length === 0) {
    return {
      text: "None of your tasks are overdue.",
      actions: [{ label: "View tasks", to: "/tasks" }],
    };
  }

  return taskList(
    overdue,
    data.projectId,
    now,
    (total) => `${total} ${plural(total, "task is", "tasks are")} overdue.`
  );
}

function answerDue(data: PylottData, now: Date): PylottAnswer {
  if (!data.tasks) return unavailable("tasks", data);

  const open = openTasks(data.tasks);
  const dated = open.filter((task) => dueTime(task) !== null);
  const undated = open.length - dated.length;

  if (dated.length === 0) {
    return {
      text:
        open.length === 0
          ? "You're all caught up. Nothing is due."
          : "None of your open tasks have a due date.",
      actions: [{ label: "View tasks", to: "/tasks" }],
    };
  }

  const answer = taskList(
    dated,
    data.projectId,
    now,
    (total) => `${total} open ${plural(total, "task has", "tasks have")} a due date.`
  );

  if (undated > 0) {
    answer.text += ` (${undated} more ${plural(undated, "task has", "tasks have")} no due date.)`;
  }
  return answer;
}

function answerDocsCount(data: PylottData): PylottAnswer {
  if (!data.documents) return unavailable("documents", data);

  const withFiles = documentsWithFiles(data.documents);
  const awaiting = data.documents.length - withFiles.length;

  let text = `You have ${withFiles.length} ${plural(withFiles.length, "document")} on file.`;
  if (awaiting > 0) {
    text += ` ${awaiting} other ${plural(awaiting, "record")} ${plural(awaiting, "doesn't", "don't")} have a file uploaded yet.`;
  }

  return { text, actions: [{ label: "View documents", to: "/documents" }] };
}

function answerDocsSummary(data: PylottData): PylottAnswer {
  if (!data.documents) return unavailable("documents", data);

  const withFiles = documentsWithFiles(data.documents);
  let expired = 0;
  let approaching = 0;
  for (const doc of withFiles) {
    const { status } = getDocumentExpiryInfo(doc);
    if (status === "expired") expired += 1;
    else if (status === "approaching") approaching += 1;
  }

  let text = `You have ${withFiles.length} ${plural(withFiles.length, "document")} on file.`;
  if (expired === 0 && approaching === 0) {
    text += " None of the documents with an expiry date are expired or expiring soon.";
  } else {
    text += ` ${expired} ${plural(expired, "is", "are")} expired and ${approaching} ${plural(approaching, "is", "are")} expiring within 30 days.`;
  }

  return { text, actions: [{ label: "View documents", to: "/documents" }] };
}

function answerDocsExpiry(data: PylottData): PylottAnswer {
  if (!data.documents) return unavailable("documents", data);

  const withFiles = documentsWithFiles(data.documents);

  const flagged = withFiles
    .map((doc) => ({ doc, info: getDocumentExpiryInfo(doc) }))
    .filter(({ info }) => info.status === "expired" || info.status === "approaching")
    .sort((a, b) => (a.info.daysLeft ?? 0) - (b.info.daysLeft ?? 0));

  // Documents with no expiry date that aren't marked "does not expire": we
  // genuinely don't know whether they expire, so say so rather than call them valid.
  const unknownExpiry = withFiles.filter(
    (doc) => !doc.does_not_expire && !doc.expiry_date
  ).length;

  const notes =
    unknownExpiry > 0
      ? ` ${unknownExpiry} ${plural(unknownExpiry, "document has", "documents have")} no expiry date recorded, so I can't tell if ${plural(unknownExpiry, "it expires", "they expire")}.`
      : "";

  if (flagged.length === 0) {
    return {
      text: `None of your documents are expired or due to expire in the next 30 days.${notes}`,
      actions: [{ label: "View documents", to: "/documents" }],
    };
  }

  const shown = flagged.slice(0, MAX_ITEMS);
  const more = flagged.length - shown.length;

  return {
    text:
      (more > 0
        ? `${flagged.length} documents are expired or expiring soon. Here are the ${shown.length} most urgent:`
        : `${flagged.length} ${plural(flagged.length, "document is", "documents are")} expired or expiring soon:`) +
      notes,
    items: shown.map(({ doc, info }) => ({
      text: `${doc.name}: ${info.label}`,
      to: "/documents",
    })),
    actions: [{ label: "View documents", to: "/documents" }],
  };
}

function answerDocsNeeded(data: PylottData, now: Date): PylottAnswer {
  if (!data.tasks) return unavailable("tasks", data);

  const requests = openTasks(data.tasks).filter(
    (task) => task.task_category_type === "document_upload"
  );

  if (requests.length === 0) {
    return {
      text: "I don't see any open document requests for you right now. I can't see a full list of every document your project requires, so check with your consultant if you think something is missing.",
      actions: [{ label: "View documents", to: "/documents" }],
    };
  }

  const answer = taskList(
    requests,
    data.projectId,
    now,
    (total) =>
      `You have ${total} open document ${plural(total, "request")}.`
  );
  answer.text += " This only covers documents your team has asked for through tasks.";
  return answer;
}

function stageSentence(stage: PylottStage): string {
  const start = formatDate(stage.startDate);
  const end = formatDate(stage.endDate);

  if (start && end) return `It started on ${start} and is estimated to finish around ${end}.`;
  if (end) return `It's estimated to finish around ${end}.`;
  return "I don't have dates for this stage yet.";
}

function answerStage(data: PylottData): PylottAnswer {
  if (!data.stage) return unavailable("stage", data);

  const { stage } = data;
  return {
    text: `Your project is at stage ${stage.index + 1} of ${stage.total}: ${stage.name}. ${stageSentence(stage)}`,
    actions: [{ label: "View journey", to: "/journey" }],
  };
}

function answerCompletion(data: PylottData): PylottAnswer {
  const actions = [{ label: "View journey", to: "/journey" }];
  const end = formatDate(data.projectEndDate);

  if (!end) {
    return {
      text: "I can't estimate a finish date yet because I don't have the start date or stage timings for your project. Your consultant can tell you more.",
      actions,
    };
  }

  let text = `Your project is estimated to be complete around ${end}. This is an estimate based on the expected length of each stage, so it can move if a stage takes longer.`;
  if (data.stage) {
    text += ` You're currently at stage ${data.stage.index + 1} of ${data.stage.total}: ${data.stage.name}.`;
  }

  return { text, actions };
}

// ── Entry point ──────────────────────────────────────────────────────────────

/**
 * Answer a client's question from their project data.
 *
 * @param question  What the client typed.
 * @param data      The project facts available to Pylott.
 * @param now       Injectable "today" so overdue logic is testable.
 */
export function answerQuestion(
  question: string,
  data: PylottData,
  now: Date = new Date()
): PylottAnswer {
  switch (detectIntent(question)) {
    case "help":
      return answerHelp();
    case "thanks":
      return answerThanks();
    case "overdue":
      return answerOverdue(data, now);
    case "docs_expiry":
      return answerDocsExpiry(data);
    case "docs_count":
      return answerDocsCount(data);
    case "docs_needed":
      return answerDocsNeeded(data, now);
    case "docs_summary":
      return answerDocsSummary(data);
    case "due":
      return answerDue(data, now);
    case "stage":
      return answerStage(data);
    case "completion":
      return answerCompletion(data);
    case "tasks":
      return answerTasks(data, now);
    default:
      return answerUnknown();
  }
}
