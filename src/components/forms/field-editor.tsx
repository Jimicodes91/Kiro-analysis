import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    useCreateFormField,
    useUpdateFormField,
} from "@/hooks/forms/use-form-fields";
import { useState } from "react";
import { ConditionalOperator } from "./conditional-evaluator";
import { FormFieldDefinition, FormFieldType } from "./field-renderer";

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Textarea" },
  { value: "dropdown", label: "Dropdown" },
  { value: "checkboxes", label: "Checkboxes" },
  { value: "radio", label: "Radio Buttons" },
  { value: "file_upload", label: "File Upload" },
  { value: "date", label: "Date" },
  { value: "number", label: "Number" },
];

const OPERATORS: { value: ConditionalOperator; label: string }[] = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "is_empty", label: "Is Empty" },
  { value: "is_not_empty", label: "Is Not Empty" },
];

interface FieldEditorProps {
  templateId: string;
  field: FormFieldDefinition | null;
  fields: FormFieldDefinition[];
  onClose: () => void;
}

export default function FieldEditor({
  templateId, field, fields, onClose,
}: FieldEditorProps) {
  const isEditing = Boolean(field);
  const createField = useCreateFormField(templateId);
  const updateField = useUpdateFormField(templateId, field?.id ?? "");

  const [type, setType] = useState<FormFieldType>(field?.type ?? "text");
  const [label, setLabel] = useState(field?.label ?? "");
  const [placeholder, setPlaceholder] = useState(field?.placeholder ?? "");
  const [helpText, setHelpText] = useState(field?.help_text ?? "");
  const [options, setOptions] = useState<string[]>(field?.options ?? [""]);
  const [optionInput, setOptionInput] = useState("");
  const [isRequired, setIsRequired] = useState(
    field?.validation_rules?.some((r: any) => r.type === "required") ?? false
  );
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [preFillSource, setPreFillSource] = useState(field?.pre_fill_source ?? "");

  // Conditional rule state
  const [hasCondition, setHasCondition] = useState(Boolean(field?.conditional_rule));
  const [condSourceId, setCondSourceId] = useState(field?.conditional_rule?.source_field_id ?? "");
  const [condOperator, setCondOperator] = useState<ConditionalOperator>(
    field?.conditional_rule?.operator ?? "equals"
  );
  const [condValue, setCondValue] = useState(String(field?.conditional_rule?.value ?? ""));

  const needsOptions = ["dropdown", "checkboxes", "radio"].includes(type);
  const currentSortOrder = field?.sort_order ?? Math.max(0, ...fields.map((f) => f.sort_order)) + 1;
  const availableSourceFields = fields.filter((f) => f.sort_order < currentSortOrder);

  const addOption = () => {
    if (optionInput.trim()) {
      setOptions([...options.filter(Boolean), optionInput.trim()]);
      setOptionInput("");
    }
  };

  const removeOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const validationRules: any[] = [];
    if (isRequired) validationRules.push({ type: "required" });
    if (minLength) validationRules.push({ type: "min_length", params: { min: Number(minLength) } });
    if (maxLength) validationRules.push({ type: "max_length", params: { max: Number(maxLength) } });

    const payload: any = {
      type, label, placeholder: placeholder || undefined,
      help_text: helpText || undefined,
      sort_order: currentSortOrder,
      validation_rules: validationRules.length > 0 ? validationRules : undefined,
      options: needsOptions ? options.filter(Boolean) : undefined,
      pre_fill_source: preFillSource || undefined,
      conditional_rule: hasCondition && condSourceId
        ? { source_field_id: condSourceId, operator: condOperator, value: condValue || undefined }
        : undefined,
    };

    try {
      if (isEditing) await updateField.mutateAsync(payload);
      else await createField.mutateAsync(payload);
      onClose();
    } catch { /* toast handled by hook */ }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <h2 className="text-lg font-semibold">{isEditing ? "Edit Field" : "Add Field"}</h2>

        <div className="space-y-1.5">
          <Label>Field Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as FormFieldType)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map((ft) => (
                <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Field label" />
        </div>

        <div className="space-y-1.5">
          <Label>Placeholder</Label>
          <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} placeholder="Placeholder text" />
        </div>

        <div className="space-y-1.5">
          <Label>Help Text</Label>
          <Textarea value={helpText} onChange={(e) => setHelpText(e.target.value)} placeholder="Help text" rows={2} />
        </div>

        {/* Options for dropdown/checkboxes/radio */}
        {needsOptions && (
          <div className="space-y-2">
            <Label>Options</Label>
            {options.filter(Boolean).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sm flex-1">{opt}</span>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeOption(idx)}>×</Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input value={optionInput} onChange={(e) => setOptionInput(e.target.value)}
                placeholder="Add option" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOption())} />
              <Button variant="outline" size="sm" onClick={addOption}>Add</Button>
            </div>
          </div>
        )}

        {/* Validation rules */}
        <div className="space-y-2 border-t pt-3">
          <Label>Validation</Label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={isRequired} onCheckedChange={(c) => setIsRequired(Boolean(c))} />
            Required
          </label>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Min Length</Label>
              <Input type="number" value={minLength} onChange={(e) => setMinLength(e.target.value)} />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Max Length</Label>
              <Input type="number" value={maxLength} onChange={(e) => setMaxLength(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Conditional rule */}
        <div className="space-y-2 border-t pt-3">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={hasCondition} onCheckedChange={(c) => setHasCondition(Boolean(c))} />
            Conditional visibility
          </label>
          {hasCondition && (
            <div className="space-y-2 pl-6">
              <Select value={condSourceId} onValueChange={setCondSourceId}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Source field" /></SelectTrigger>
                <SelectContent>
                  {availableSourceFields.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={condOperator} onValueChange={(v) => setCondOperator(v as ConditionalOperator)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!["is_empty", "is_not_empty"].includes(condOperator) && (
                <Input value={condValue} onChange={(e) => setCondValue(e.target.value)} placeholder="Comparison value" />
              )}
            </div>
          )}
        </div>

        {/* Pre-fill source */}
        <div className="space-y-1.5 border-t pt-3">
          <Label>Pre-fill Source</Label>
          <Select value={preFillSource} onValueChange={setPreFillSource}>
            <SelectTrigger className="w-full"><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="name">Contact Name</SelectItem>
              <SelectItem value="email">Contact Email</SelectItem>
              <SelectItem value="phone">Contact Phone</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}
            isLoading={createField.isPending || updateField.isPending}>
            {isEditing ? "Update" : "Add"} Field
          </Button>
        </div>
      </div>
    </div>
  );
}
