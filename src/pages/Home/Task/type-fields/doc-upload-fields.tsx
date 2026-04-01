import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DocUploadFieldsProps {
  control: any;
}

export default function DocUploadFields({ control }: DocUploadFieldsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-sm font-semibold text-gray-700">
        Document Upload Configuration
      </p>

      <FormField
        control={control}
        name="form_config.document_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Document name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Proof of address"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="form_config.document_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the document requirements…"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="form_config.accepted_file_types"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accepted file types</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. pdf, docx, jpg, png"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="form_config.max_file_size_mb"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max file size (MB)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                placeholder="5"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
