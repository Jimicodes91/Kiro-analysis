import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { useState } from "react";

// Define field types
type FieldType = "text" | "textarea" | "select" | "date" | "dropdown";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  isCustom?: boolean;
  options?: string[]; // For select/dropdown fields
  value?: string | number | Date | null;
}

const FormCustomization: React.FC = () => {
  // Initial form fields based on your design
  const [fields, setFields] = useState<FormField[]>([
    { id: "project-name", type: "text", label: "Project name", required: true },
    { id: "pipeline", type: "dropdown", label: "Pipeline", required: true },
    { id: "description", type: "textarea", label: "Description", required: true },
    { id: "project-client", type: "text", label: "Project client", required: true },
    { id: "client-name", type: "text", label: "Client name", required: true },
    { id: "project-value", type: "text", label: "Project value", required: true },
    { id: "nationality", type: "dropdown", label: "Nationality", required: true },
    {
      id: "resident-country",
      type: "dropdown",
      label: "Resident country",
      required: true,
    },
    { id: "post-code", type: "text", label: "Post code", required: true },
    { id: "phone-number", type: "text", label: "Phone number", required: true },
    { id: "email-address", type: "text", label: "Email address", required: true },
    { id: "start-date", type: "date", label: "Start date", required: true },
    { id: "end-date", type: "date", label: "End date", required: true },
  ]);

  const [customFieldCount, setCustomFieldCount] = useState(0);

  // Add a new custom field
  const addCustomField = () => {
    const newId = `custom-field-${customFieldCount}`;
    setFields([
      ...fields,
      {
        id: newId,
        type: "text",
        label: "Untitled",
        required: true,
        isCustom: true,
      },
    ]);
    setCustomFieldCount(customFieldCount + 1);
  };

  // Remove a field
  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  // Update a field's properties
  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((field) => (field.id === id ? { ...field, ...updates } : field))
    );
  };

  // Render a field based on its type
  const renderField = (field: FormField) => {
    const { id, type, label, value } = field;

    return (
      <div key={id} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          {field.isCustom ? (
            <Input
              value={label}
              className="w-40 font-medium"
              onChange={(e) => updateField(id, { label: e.target.value })}
            />
          ) : (
            <label className="font-medium">{label}</label>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeField(id)}
            className="h-8 w-8 text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {type === "text" && (
          <Input
            placeholder={label}
            value={value instanceof Date ? value.toISOString() : value || ""}
            onChange={(e) => updateField(id, { value: e.target.value })}
            className="w-full"
          />
        )}

        {type === "textarea" && (
          <Textarea
            placeholder={label}
            value={value instanceof Date ? value.toISOString() : value || ""}
            onChange={(e) => updateField(id, { value: e.target.value })}
            className="w-full h-24"
          />
        )}

        {type === "dropdown" && (
          <Select
            value={typeof value === "string" ? value : undefined}
            onValueChange={(val) => updateField(id, { value: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        )}

        {type === "date" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                {value ? format(value, "PPP") : `Select ${label.toLowerCase()}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value instanceof Date ? value : undefined}
                onSelect={(date) => updateField(id, { value: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}

        {field.isCustom && (
          <div className="mt-2">
            <Select
              value={type}
              onValueChange={(val: FieldType) => updateField(id, { type: val })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Field</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          {fields.map(renderField)}

          <Button
            variant="ghost"
            onClick={addCustomField}
            className="mt-4 w-full flex items-center justify-center border border-dashed border-gray-300 py-3 text-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add custom field
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormCustomization;
