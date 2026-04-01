import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useFormTemplates from "@/hooks/forms/use-form-templates";

interface TemplateSelectorProps {
  value?: string;
  onChange: (templateId: string) => void;
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const { value: data, isLoading } = useFormTemplates();
  const allTemplates: any[] = data?.data ?? [];
  const published = allTemplates.filter((t: any) => t.status === "published");

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading templates...</p>;
  }

  if (published.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-400">
        No published templates available. Create and publish a template in the Admin &gt; Forms section first.
      </div>
    );
  }

  return (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a form template..." />
      </SelectTrigger>
      <SelectContent>
        {published.map((t: any) => (
          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
