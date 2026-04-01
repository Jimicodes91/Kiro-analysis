import DragNdrop from "@/components/ui/file-upload";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SigningTaskFieldsProps {
  control: any;
}

export default function SigningTaskFields({ control }: SigningTaskFieldsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-sm font-semibold text-gray-700">Signing Details</p>

      <FormField
        control={control}
        name="form_config.signer_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Signer name / email</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. john@example.com"
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
        name="form_config.signing_instructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Signing instructions</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Instructions for the signer…"
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
        name="form_config.signing_documents"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Document for signing</FormLabel>
            <FormControl>
              <DragNdrop
                id="signing-doc-upload"
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
