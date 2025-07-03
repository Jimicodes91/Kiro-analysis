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
import {
  FieldType,
  IFormField,
} from "@/hooks/project-modules/project-forms/use-get-project-form-fields";
import useDisclosure from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import AddCustomFieldForm from "./add-custom-field";

// Define field types

const FormCustomization = ({ customFields }: { customFields: IFormField[] }) => {
  // Initial form fields based on your design
  const [fields, setFields] = useState<IFormField[]>([...customFields]);
  // const [customFieldCount, setCustomFieldCount] = useState(0);
  const { onClose, onToggle, isOpen } = useDisclosure();

  // Add a new custom field
  // const addCustomField = () => {
  //   const newId = `custom-field-${customFieldCount}`;
  //   setFields([
  //     ...fields,
  //     {
  //       id: newId,
  //       type: "text",
  //       name: "Untitled",
  //       is_required: 1,
  //       isCustom: true,
  //       form_id: "",
  //       company_id: "",
  //       is_custom: 0,
  //       is_multiple: 0,
  //       sort_order: 0,
  //       slug: "",
  //     },
  //   ]);
  //   setCustomFieldCount(customFieldCount + 1);
  // };

  // Remove a field
  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  // Update a field's properties
  const updateField = (id: string, updates: Partial<IFormField>) => {
    setFields(
      fields.map((field) => (field.id === id ? { ...field, ...updates } : field))
    );
  };

  // Render a field based on its type
  const renderField = (field: IFormField) => {
    const { id, type, name, is_required } = field;

    return (
      <div key={id} className="mb-4">
        <div className="flex justify-between items-center mb-1">
          {field.isCustom ? (
            <Input
              value={name}
              className="w-40 font-medium"
              onChange={(e) => updateField(id, { name: e.target.value })}
            />
          ) : (
            <label className="font-medium text-sm">{name}</label>
          )}

          {is_required === 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeField(id)}
              className="h-8 w-8 text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {(type === "text" || type === "number") && (
          <Input disabled placeholder={name} className="w-full" />
        )}

        {/* {type === "textarea" && (
          <Textarea
            placeholder={label}
            value={value instanceof Date ? value.toISOString() : value || ""}
            onChange={(e) => updateField(id, { value: e.target.value })}
            className="w-full h-24"
          />
        )} */}

        {type === "select" && (
          <Select disabled>
            <SelectTrigger className="rounded-full w-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
              <SelectValue placeholder={name} />
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
                  "text-muted-foreground"
                )}
              >
                {`Select ${name.toLowerCase()}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" initialFocus />
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
          {fields.sort((a, b) => a.sort_order - b.sort_order).map(renderField)}

          {isOpen && <AddCustomFieldForm isOpen={isOpen} onClose={onClose} />}

          <div className="flex items-center">
            <button
              onClick={onToggle}
              className={`flex items-center text-sm font-semibold text-black hover:text-primary`}
            >
              <span className="mr-1 text-xl">
                <IoAdd className={"text-black"} />
              </span>
              Add custom field
            </button>
            {/* Line beside the button */}
            <div className="flex-grow border-t border-gray-200 ml-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCustomization;
