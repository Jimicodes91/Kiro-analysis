import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Control, Controller } from "react-hook-form";

export type FormFieldType =
  | "text" | "textarea" | "dropdown" | "checkboxes"
  | "radio" | "file_upload" | "date" | "number";

export interface FormFieldDefinition {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  help_text?: string;
  sort_order: number;
  validation_rules?: any[];
  conditional_rule?: any;
  pre_fill_source?: string | null;
  options?: string[];
  file_config?: { accepted_types: string[]; max_size_mb: number };
}

interface FieldRendererProps {
  field: FormFieldDefinition;
  control: Control<any>;
  error?: string;
}

function renderField(field: FormFieldDefinition, rhf: any) {
  switch (field.type) {
    case "text":
      return (
        <Input id={field.id} placeholder={field.placeholder}
          value={rhf.value ?? ""} onChange={rhf.onChange} onBlur={rhf.onBlur} />
      );
    case "textarea":
      return (
        <Textarea id={field.id} placeholder={field.placeholder}
          value={rhf.value ?? ""} onChange={rhf.onChange} onBlur={rhf.onBlur} />
      );
    case "number":
      return (
        <Input id={field.id} type="number" placeholder={field.placeholder}
          value={rhf.value ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            rhf.onChange(e.target.value === "" ? "" : Number(e.target.value))}
          onBlur={rhf.onBlur} />
      );
    case "date":
      return (
        <Input id={field.id} type="date" value={rhf.value ?? ""}
          onChange={rhf.onChange} onBlur={rhf.onBlur} />
      );
    case "dropdown":
      return (
        <Select onValueChange={rhf.onChange} value={rhf.value ?? ""}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "radio":
      return (
        <div className="flex flex-col gap-2">
          {(field.options ?? []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name={field.id} value={opt}
                checked={rhf.value === opt} onChange={() => rhf.onChange(opt)}
                className="accent-black" />
              {opt}
            </label>
          ))}
        </div>
      );
    case "checkboxes": {
      const values: string[] = rhf.value ?? [];
      return (
        <div className="flex flex-col gap-2">
          {(field.options ?? []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={values.includes(opt)}
                onCheckedChange={(c: boolean) => {
                  if (c) rhf.onChange([...values, opt]);
                  else rhf.onChange(values.filter((v: string) => v !== opt));
                }} />
              {opt}
            </label>
          ))}
        </div>
      );
    }
    case "file_upload":
      return (
        <Input id={field.id} type="file"
          accept={field.file_config?.accepted_types?.join(",")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            rhf.onChange(e.target.files?.[0] ?? null)} />
      );
    default:
      return (
        <Input id={field.id} placeholder={field.placeholder}
          value={rhf.value ?? ""} onChange={rhf.onChange} />
      );
  }
}

export default function FieldRenderer({ field, control, error }: FieldRendererProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.id}>{field.label}</Label>
      {field.help_text && <p className="text-xs text-gray-500">{field.help_text}</p>}
      <Controller name={field.id} control={control}
        render={({ field: rhf }) => renderField(field, rhf)} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
