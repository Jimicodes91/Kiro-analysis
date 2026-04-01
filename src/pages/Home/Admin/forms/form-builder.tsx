import FieldEditor from "@/components/forms/field-editor";
import { FormFieldDefinition } from "@/components/forms/field-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    useCreateFormField,
    useReorderFormFields
} from "@/hooks/forms/use-form-fields";
import {
    usePublishFormTemplate,
    useUpdateFormTemplate,
} from "@/hooks/forms/use-form-template";
import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { useState } from "react";
import { useParams } from "react-router-dom";

interface TemplateData {
  id: string;
  name: string;
  description: string | null;
  status: string;
  fields?: FormFieldDefinition[];
}

export default function FormBuilder() {
  const { templateId } = useParams<{ templateId: string }>();
  const id = templateId ?? "";

  const { value, isLoading, refetch } = useQueryActionHook<any>({
    method: "get",
    endpoint: ENDPOINTS.GET_FORM_TEMPLATE(id),
    queryKey: [QUERYKEYS.GET_FORM_TEMPLATE, id],
    enabled: Boolean(id),
  });

  const template: TemplateData | null = value?.data ?? null;
  const fields: FormFieldDefinition[] = template?.fields ?? [];

  const updateTemplate = useUpdateFormTemplate(id);
  const publishTemplate = usePublishFormTemplate(id);
  const createField = useCreateFormField(id);
  const reorderFields = useReorderFormFields(id);

  const [editingField, setEditingField] = useState<FormFieldDefinition | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameLoaded, setNameLoaded] = useState(false);

  if (template && !nameLoaded) {
    setName(template.name);
    setDescription(template.description ?? "");
    setNameLoaded(true);
  }

  const handleSaveMeta = async () => {
    await updateTemplate.mutateAsync({ name, description } as any);
  };

  const handlePublish = async () => {
    await publishTemplate.mutateAsync({} as any);
  };

  const handleAddField = () => {
    setEditingField(null);
    setShowFieldEditor(true);
  };

  const handleEditField = (f: FormFieldDefinition) => {
    setEditingField(f);
    setShowFieldEditor(true);
  };

  const handleMoveField = async (index: number, direction: "up" | "down") => {
    const sorted = [...fields].sort((a, b) => a.sort_order - b.sort_order);
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const newOrders = sorted.map((f, i) => {
      if (i === index) return { id: f.id, sort_order: sorted[swapIdx].sort_order };
      if (i === swapIdx) return { id: f.id, sort_order: sorted[index].sort_order };
      return { id: f.id, sort_order: f.sort_order };
    });
    await reorderFields.mutateAsync({ field_orders: newOrders } as any);
  };

  if (isLoading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!template) return <p className="p-6 text-gray-500">Template not found.</p>;

  const sortedFields = [...fields].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="p-6 space-y-6 page-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Form Builder</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowVersions(!showVersions)}>
            {showVersions ? "Hide Versions" : "Version History"}
          </Button>
          <Button onClick={handlePublish} isLoading={publishTemplate.isPending}>
            Publish
          </Button>
        </div>
      </div>

      {/* Template metadata */}
      <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
        <Input value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Template name" className="text-lg font-medium" />
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)" rows={2} />
        <Button variant="outline" size="sm" onClick={handleSaveMeta}
          isLoading={updateTemplate.isPending}>
          Save Details
        </Button>
      </div>

      {/* Fields list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Fields</h2>
          <Button variant="outline" size="sm" onClick={handleAddField}>
            Add Field
          </Button>
        </div>

        {sortedFields.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center border border-dashed rounded-lg">
            No fields yet. Click "Add Field" to start building your form.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedFields.map((f, idx) => (
              <FieldRow key={f.id} field={f} index={idx} total={sortedFields.length}
                onEdit={() => handleEditField(f)}
                onMove={(dir) => handleMoveField(idx, dir)}
                templateId={id} />
            ))}
          </div>
        )}
      </div>

      {/* Version history panel */}
      {showVersions && <VersionHistoryPanel templateId={id} />}

      {/* Field editor modal */}
      {showFieldEditor && (
        <FieldEditor
          templateId={id}
          field={editingField}
          fields={sortedFields}
          onClose={() => { setShowFieldEditor(false); setEditingField(null); }}
        />
      )}
    </div>
  );
}

function FieldRow({ field, index, total, onEdit, onMove, templateId }: {
  field: FormFieldDefinition; index: number; total: number;
  onEdit: () => void; onMove: (dir: "up" | "down") => void; templateId: string;
}) {
  const deleteField = useDeleteFormField(templateId, field.id);
  const typeIcons: Record<string, string> = {
    text: "Aa", textarea: "¶", dropdown: "▼", checkboxes: "☑",
    radio: "◉", file_upload: "📎", date: "📅", number: "#",
  };
  return (
    <div className="flex items-center gap-3 border rounded-lg px-4 py-3 bg-white">
      <span className="text-lg w-8 text-center">{typeIcons[field.type] ?? "?"}</span>
      <div className="flex-1">
        <p className="font-medium text-sm">{field.label}</p>
        <p className="text-xs text-gray-400">{field.type}</p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" disabled={index === 0}
          onClick={() => onMove("up")}>↑</Button>
        <Button variant="ghost" size="sm" disabled={index === total - 1}
          onClick={() => onMove("down")}>↓</Button>
        <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
        <Button variant="ghost" size="sm" className="text-red-500"
          onClick={() => deleteField.mutateAsync({} as any)}
          isLoading={deleteField.isPending}>Delete</Button>
      </div>
    </div>
  );
}

function VersionHistoryPanel({ templateId }: { templateId: string }) {
  const { value, isLoading } = useFormVersions(templateId);
  const versions: any[] = value?.data ?? [];

  return (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <h3 className="font-medium">Version History</h3>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading versions...</p>
      ) : versions.length === 0 ? (
        <p className="text-sm text-gray-400">No versions yet. Publish to create the first version.</p>
      ) : (
        <div className="space-y-2">
          {versions.map((v: any) => (
            <div key={v.id} className="flex items-center justify-between border rounded px-3 py-2 bg-white text-sm">
              <span className="font-medium">Version {v.version_number}</span>
              <span className="text-gray-500">
                {v.created_at ? format(new Date(v.created_at), "MMM d, yyyy HH:mm") : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
