// Feature: client-documents-tasks, Property 5
/**
 * Property 5: Task-creation payload mapping
 *
 * **Validates: Requirements 3.3, 3.4, 8.2, 9.1, 9.4**
 *
 * For any valid external task form input (a name, a selected client task type
 * from the allowed set, a due date, at least one assigned client, and an
 * optional description), the submitted create-task payload carries the selected
 * `task_category_type` unchanged, the due date, the assigned clients, and the
 * description — and requires no linked form configuration when the selected type
 * is `complete_form`.
 *
 * The payload mapping (`buildExternalTaskPayload`) is exercised as a pure
 * function so the property is fully deterministic and free of rendering flakiness.
 */
import { getUTCISODateFormat } from "@/lib/utils";
import { TaskCategory } from "@/types/task.types";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
    buildExternalTaskPayload,
    EXTERNAL_CATEGORY_TYPES,
} from "./external-task-form";

const ALLOWED_TYPES = EXTERNAL_CATEGORY_TYPES.map((t) => t.value);

// The 5 allowed client task types
const taskCategoryTypeArb = fc.constantFrom(...ALLOWED_TYPES);

// At least one client id, all non-empty
const clientIdsArb = fc.array(
  fc.string({ minLength: 1, maxLength: 24 }).filter((s) => s.trim().length > 0),
  { minLength: 1, maxLength: 5 }
);

// A valid due date (Date object, as produced by the calendar field)
const dueDateArb = fc
  .date({ min: new Date("2015-01-02"), max: new Date("2100-01-01") })
  .filter((d) => !Number.isNaN(d.getTime()));

// Optional description
const descriptionArb = fc.option(fc.string({ maxLength: 200 }), {
  nil: undefined,
});

const contextArb = fc.record({
  projectId: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
  projectTypeId: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
});

describe("Property 5: Task-creation payload mapping", () => {
  it("carries task_category_type, due date, clients, and description into the payload", () => {
    fc.assert(
      fc.property(
        taskCategoryTypeArb,
        clientIdsArb,
        dueDateArb,
        descriptionArb,
        contextArb,
        (task_category_type, client_ids, end_date, description, context) => {
          const payload = buildExternalTaskPayload(
            { task_category_type, client_ids, end_date, description },
            context
          );

          // task_category_type persists unchanged (Req 3.3, 9.4)
          expect(payload.task_category_type).toBe(task_category_type);

          // due date maps through the canonical UTC formatter (Req 9.1)
          expect(payload.due_date).toBe(getUTCISODateFormat(end_date));

          // assigned clients are carried through unchanged (Req 9.1)
          expect(payload.client_ids).toEqual(client_ids);

          // description is carried through (Req 3.4, 8.2)
          expect(payload.description).toBe(description);

          // category is always external and marked visible to the client
          expect(payload.task_category).toBe(TaskCategory.EXTERNAL);
          expect(payload.is_visible_to_client).toBe(true);

          // project context is threaded in
          expect(payload.project_id).toBe(context.projectId);
          expect(payload.project_type_id).toBe(context.projectTypeId);

          // no form_config was supplied, so none should be added — this holds
          // for every allowed type, including complete_form (Req 3.4)
          expect(payload.form_config).toBeUndefined();
        }
      ),
      { numRuns: 200 }
    );
  });

  it("requires no form config when the type is complete_form", () => {
    fc.assert(
      fc.property(
        clientIdsArb,
        dueDateArb,
        descriptionArb,
        contextArb,
        (client_ids, end_date, description, context) => {
          const payload = buildExternalTaskPayload(
            {
              task_category_type: "complete_form",
              client_ids,
              end_date,
              description,
              // no form_config provided
            },
            context
          );

          expect(payload.task_category_type).toBe("complete_form");
          // complete_form persists with no linked form configuration (Req 3.4)
          expect(payload.form_config).toBeUndefined();
          expect("form_config" in payload).toBe(false);
        }
      ),
      { numRuns: 150 }
    );
  });
});
