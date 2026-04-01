import TemplateSelector from "@/components/forms/template-selector";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWatch } from "react-hook-form";

interface InfoRequestFieldsProps {
  control: any;
}

export default function InfoRequestFields({ control }: InfoRequestFieldsProps) {
  const mode = useWatch({ control, name: "form_config.mode" });

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-sm font-semibold text-gray-700">
        Information Request Details
      </p>

      <FormField
        control={control}
        name="form_config.mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mode</FormLabel>
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl className="h-12 w-full">
                <SelectTrigger className="rounded-full border-brand-border border bg-transparent px-3 py-4 text-sm">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="native">Native form</SelectItem>
                <SelectItem value="external">External link</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {mode === "external" && (
        <FormField
          control={control}
          name="form_config.external_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {mode === "native" && (
        <FormField
          control={control}
          name="form_config.form_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Form Template</FormLabel>
              <FormControl>
                <TemplateSelector
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="form_config.request_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Request description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe what information is needed…"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
