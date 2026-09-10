/**
 * Pure resolver for the client task view action UI.
 *
 * Centralizes the decision of which action affordance to render for a client
 * task, based on its `task_category_type` and lifecycle `status`. Extracting
 * this from `client-task-view.tsx` keeps the rendering logic in the component
 * unchanged while making the decision independently testable.
 *
 * Feature: client-documents-tasks (Part 4/5/6)
 */

/**
 * The set of distinct action-UI states the client task view can present.
 *
 * - `document_upload` — file upload control (Requirement 4.1, 5.1)
 * - `signing` — review/sign action UI (Requirement 4.2)
 * - `information_request` — information-entry UI (Requirement 4.3)
 * - `complete_form` — form placeholder UI, no external connection (Requirement 4.5)
 * - `general` — general completion UI; also the fallback for `task` and any
 *   unrecognized type (Requirements 4.4, 4.6)
 * - `completed` — the completed state; no upload affordance is presented
 *   (Requirement 6.4)
 */
export type ActionUiKind =
  | "document_upload"
  | "signing"
  | "information_request"
  | "complete_form"
  | "general"
  | "completed";

/** Category types that map to a dedicated (non-general) action UI. */
const RECOGNIZED_ACTION_TYPES: ReadonlySet<string> = new Set([
  "document_upload",
  "signing",
  "information_request",
  "complete_form",
]);

/**
 * Resolve which action UI kind to present for a task.
 *
 * A `completed` status always wins and resolves to the `completed` state,
 * which presents no upload affordance (Requirement 6.4). Otherwise the
 * `taskCategoryType` selects the affordance: recognized types map to their
 * designated UI, and any unrecognized type (including `task` and `undefined`)
 * falls back to the general completion UI (Requirements 4.4, 4.6).
 *
 * This function is total: it always returns a defined `ActionUiKind`.
 */
export function resolveActionUiKind(
  taskCategoryType: string | undefined,
  status: string
): ActionUiKind {
  // Completed state hides the action affordance entirely (Req 6.4).
  if (status === "completed") {
    return "completed";
  }

  if (taskCategoryType !== undefined && RECOGNIZED_ACTION_TYPES.has(taskCategoryType)) {
    return taskCategoryType as ActionUiKind;
  }

  // `task` and any unrecognized type fall back to general completion (Req 4.4, 4.6).
  return "general";
}

/**
 * Whether the resolved action UI presents an upload affordance.
 *
 * Only the `document_upload` kind exposes a file upload control. The
 * `completed` state (and every other kind) presents none, which is what
 * enforces "the completed state hides the upload UI" (Requirement 6.4).
 */
export function hasUploadAffordance(kind: ActionUiKind): boolean {
  return kind === "document_upload";
}
