import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    useCloneFormTemplate,
    useCreateFormTemplate,
    useDeleteFormTemplate,
} from "@/hooks/forms/use-form-template";
import useFormTemplates from "@/hooks/forms/use-form-templates";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormTemplate {
  id: string;
  name: string;
  status: string;
  updated_at: string;
}

export default function TemplateLibrary() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { value, isLoading } = useFormTemplates(search || undefined);
  const createTemplate = useCreateFormTemplate();

  const templates: FormTemplate[] = value?.data ?? [];

  const handleCreate = async () => {
    try {
      const res = await createTemplate.mutateAsync({
        name: "Untitled Form",
      } as any);
      const newId = (res as any)?.data?.data?.id;
      if (newId) navigate(`/admin/forms/${newId}`);
    } catch { /* toast handled by hook */ }
  };

  return (
    <div className="p-6 space-y-6 page-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Form Templates</h1>
        <Button onClick={handleCreate} isLoading={createTemplate.isPending}>
          Create Template
        </Button>
      </div>

      <Input placeholder="Search templates..." value={search}
        onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-sm text-gray-400">No templates found. Create one to get started.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Updated</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <TemplateRow key={t.id} template={t} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TemplateRow({ template }: { template: FormTemplate }) {
  const navigate = useNavigate();
  const cloneTemplate = useCloneFormTemplate(template.id);
  const deleteTemplate = useDeleteFormTemplate(template.id);

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="px-4 py-3 font-medium">{template.name}</td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
          template.status === "published"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}>
          {template.status}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-500">
        {template.updated_at ? format(new Date(template.updated_at), "MMM d, yyyy") : "—"}
      </td>
      <td className="px-4 py-3 text-right space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/forms/${template.id}`)}>
          Edit
        </Button>
        <Button variant="ghost" size="sm"
          onClick={() => cloneTemplate.mutateAsync({} as any)}
          isLoading={cloneTemplate.isPending}>
          Clone
        </Button>
        <Button variant="ghost" size="sm" className="text-red-500"
          onClick={() => deleteTemplate.mutateAsync({} as any)}
          isLoading={deleteTemplate.isPending}>
          Delete
        </Button>
      </td>
    </tr>
  );
}
