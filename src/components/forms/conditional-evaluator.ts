// Client-side port of the backend conditional evaluator.
// Pure function — no side effects, no imports needed.

export type ConditionalOperator = 'equals' | 'not_equals' | 'contains' | 'is_empty' | 'is_not_empty';

export interface ConditionalRule {
  source_field_id: string;
  operator: ConditionalOperator;
  value?: string | number | boolean;
}

/**
 * Evaluates a conditional rule against current field values.
 * Returns true if the field should be visible, false if it should be hidden.
 */
export function evaluateCondition(
  rule: ConditionalRule,
  fieldValues: Record<string, any>
): boolean {
  const sourceValue = fieldValues[rule.source_field_id];

  switch (rule.operator) {
    case 'equals':
      return sourceValue === rule.value;
    case 'not_equals':
      return sourceValue !== rule.value;
    case 'contains':
      return typeof sourceValue === 'string' && sourceValue.includes(String(rule.value));
    case 'is_empty':
      return sourceValue === null || sourceValue === undefined || sourceValue === '';
    case 'is_not_empty':
      return sourceValue !== null && sourceValue !== undefined && sourceValue !== '';
    default:
      return true; // unknown operator = show field
  }
}
