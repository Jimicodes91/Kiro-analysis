import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import useGetCompanyContacts from "@/hooks/contacts/use-get-company-contact";
import useCreateProjectTask from "@/hooks/project-modules/tasks/use-create-project-task";
import useCreateStandaloneTask from "@/hooks/project-modules/tasks/use-create-standalone-task";
import useGetAllCompanyProjects from "@/hooks/project-modules/use-get-all-company-projects";
import { cn, getSelectableDate, getUTCISODateFormat } from "@/lib/utils";
import { TaskCategory, TaskCategoryType } from "@/types/task.types";
import { format } from "date-fns";
import { CalendarIcon, Check, ClipboardList, Handshake, ListTodo, MessageSquare, Phone, Search, Star, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const CATEGORY_ICONS = [
  { type: TaskCategoryType.ACTIVITY, label: "Activity", icon: Star },
  { type: TaskCategoryType.MEETING, label: "Meeting", icon: Handshake },
  { type: TaskCategoryType.TASK, label: "Task", icon: ListTodo },
  { type: TaskCategoryType.FOLLOW_UP, label: "Follow Up", icon: Phone },
  { type: TaskCategoryType.MESSAGE, label: "Message", icon: MessageSquare },
  { type: TaskCategoryType.REVIEW, label: "Review", icon: ClipboardList },
] as const;

interface ProjectContext {
  projectId: string;
  projectTypeId: string;
  projectName: string;
  clients?: { id: string; name: string; email?: string }[];
}

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectContext?: ProjectContext;
}

// ── Searchable single-select picker (project / contact) ──
function SearchableSinglePicker({ label, options, selectedId, onChange, placeholder, isLoading }: {
  label: string;
  options: { id: string; label: string; sublabel?: string }[];
  selectedId: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  isLoading?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter(
    (o) => o.label.toLowerCase().includes(search.toLowerCase()) ||
      (o.sublabel && o.sublabel.toLowerCase().includes(search.toLowerCase()))
  );
  const selected = options.find((o) => o.id === selectedId);

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1" ref={ref}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder ?? "Search..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full h-10 pl-9 pr-3 rounded-full border border-brand-border bg-transparent text-sm placeholder:text-brand-placeholder focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {isLoading && <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>}
            {!isLoading && filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">No results found</p>
            )}
            {!isLoading && filtered.map((opt) => (
              <div
                key={opt.id}
                className="flex items-center px-3 py-2 text-sm hover:bg-[#E0EFDE4D] cursor-pointer"
                onClick={() => { onChange(opt.id); setSearch(""); setIsOpen(false); }}
              >
                <span className="flex-1">
                  {opt.label}
                  {opt.sublabel && <span className="text-gray-400 ml-1 text-xs">{opt.sublabel}</span>}
                </span>
                {selectedId === opt.id && <Check className="w-4 h-4 text-black" />}
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F3F3] rounded-full text-sm">
            {selected.label}
            <button type="button" onClick={() => onChange(null)} className="hover:text-red-500">
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

// ── Searchable multi-select picker (assignees) ──
function SearchableMultiPicker({ label, options, selectedIds, onChange, placeholder }: {
  label: string;
  options: { id: string; label: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]);
  };
  const selectedItems = selectedIds
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean) as { id: string; label: string }[];

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1" ref={ref}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder ?? "Search..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full h-10 pl-9 pr-3 rounded-full border border-brand-border bg-transparent text-sm placeholder:text-brand-placeholder focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">No results found</p>
            )}
            {filtered.map((opt) => {
              const isSel = selectedIds.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  className="flex items-center px-3 py-2 text-sm hover:bg-[#E0EFDE4D] cursor-pointer"
                  onClick={() => toggle(opt.id)}
                >
                  <span className="flex-1">{opt.label}</span>
                  <div className={cn(
                    "flex items-center justify-center w-[18px] h-[18px] border rounded",
                    isSel ? "bg-black border-black" : "border-gray-500"
                  )}>
                    {isSel && <Check className="text-white w-[14px] h-[14px]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedItems.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F3F3] rounded-full text-sm"
            >
              {item.label}
              <button type="button" onClick={() => toggle(item.id)} className="hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ──
const ActivityFormModal = ({ isOpen, onClose, projectContext }: ActivityFormModalProps) => {
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState<TaskCategoryType | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string | null>(projectContext?.projectId ?? null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [markAsDone, setMarkAsDone] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const companyUsersQuery = useGetCompanyUsers();
  const projectsQuery = useGetAllCompanyProjects();
  const contactsQuery = useGetCompanyContacts();
  const createStandaloneTask = useCreateStandaloneTask();
  const createProjectTask = useCreateProjectTask(projectId ?? "");

  const assigneeOptions = useMemo(() => {
    const users = companyUsersQuery?.value?.data ?? [];
    return users
      .filter((u) => (u.role || "").toLowerCase() !== "client")
      .map((u) => ({ id: u.id, label: u.name || u.email || "Unknown" }));
  }, [companyUsersQuery?.value]);

  const projectOptions = useMemo(() => {
    const projects = projectsQuery?.value?.data ?? [];
    return projects.map((p) => ({ id: p.id, label: p.name, projectTypeId: p.project_type_id }));
  }, [projectsQuery?.value]);

  const contactOptions = useMemo(() => {
    // In project context, use project's clients
    if (projectContext?.clients?.length) {
      return projectContext.clients.map((c) => ({ id: c.id, label: c.name, sublabel: c.email }));
    }
    const contacts = contactsQuery?.value?.data?.contacts ?? [];
    return contacts.map((c) => ({ id: c.id, label: c.name, sublabel: c.email }));
  }, [contactsQuery?.value, projectContext?.clients]);

  const handleContactChange = (id: string | null) => {
    setContactId(id);
    if (id) {
      const contact = contactOptions.find((c) => c.id === id);
      if (contact && !name.trim()) setName(contact.label);
    }
  };

  const resetForm = () => {
    setName("");
    setCategoryType(null);
    setDueDate(null);
    setDescription("");
    setAssignees([]);
    setProjectId(projectContext?.projectId ?? null);
    setContactId(null);
    setMarkAsDone(false);
  };

  // Save handler — routes to standalone or project-bound endpoint
  const handleSave = async () => {
    const payload: Record<string, any> = {
      name: name || (categoryType ? CATEGORY_ICONS.find((c) => c.type === categoryType)?.label ?? "Untitled Activity" : "Untitled Activity"),
      task_category: TaskCategory.INTERNAL,
      is_visible_to_client: false,
      status: markAsDone ? "completed" : "draft",
    };
    if (categoryType) payload.task_category_type = categoryType;
    if (dueDate) payload.due_date = getUTCISODateFormat(dueDate);
    if (description) payload.description = description;
    if (assignees.length > 0) payload.assignees = assignees;
    if (contactId) payload.contact_id = contactId;

    try {
      if (projectId) {
        // Get project_type_id from project context or from the selected project data
        const typeId = projectContext?.projectTypeId
          || projectOptions.find((p) => p.id === projectId)?.projectTypeId;
        if (typeId) payload.project_type_id = typeId;
        await createProjectTask.mutateAsync(payload as any);
      } else {
        await createStandaloneTask.mutateAsync(payload as any);
      }
      resetForm();
      onClose();
    } catch (error) {
      // Error handling is built into the mutation hooks (toast/error display)
      console.error("Failed to create activity:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isSaving = createStandaloneTask.isPending || createProjectTask.isPending;

  return (
    <Modal
      title="New Activity"
      closeModal={handleCancel}
      isOpen={isOpen}
      closeOnEsc={!isSaving}
      closeOnOverlayClick={false}
    >
      <div className="flex flex-col gap-4 p-4">
        {/* 1. Subject line */}
        <Input
          placeholder="Activity subject..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-lg font-medium h-12 border-brand-border rounded-full"
        />

        {/* 2. Category icon row */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {CATEGORY_ICONS.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setCategoryType(type)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs transition-colors",
                  categoryType === type
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-400 text-gray-600"
                )}
                title={label}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Due date picker */}
        <div>
          <label className="text-sm font-medium">Due date</label>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full font-normal h-10 rounded-full border-brand-border border bg-transparent px-3 text-sm mt-1",
                  !dueDate && "text-muted-foreground"
                )}
              >
                {dueDate ? (
                  format(dueDate, "PPP")
                ) : (
                  <span className="text-brand-placeholder">Select due date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate ?? undefined}
                onSelect={(date) => {
                  setDueDate(date ?? null);
                  setDatePickerOpen(false);
                }}
                disabled={getSelectableDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 4. Notes textarea */}
        <div>
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            placeholder="Add notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 min-h-[80px] rounded-xl border-brand-border"
          />
        </div>

        {/* 5. Assigned to (internal employees only) */}
        <SearchableMultiPicker
          label="Assigned to"
          options={assigneeOptions}
          selectedIds={assignees}
          onChange={setAssignees}
          placeholder="Search team members..."
        />

        {/* 6. Link to Project */}
        {projectContext ? (
          <div>
            <label className="text-sm font-medium">Project</label>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F3F3] rounded-full text-sm">
                {projectContext.projectName}
              </span>
            </div>
          </div>
        ) : (
          <SearchableSinglePicker
            label="Link to Project"
            options={projectOptions}
            selectedId={projectId}
            onChange={setProjectId}
            placeholder="Search projects..."
            isLoading={projectsQuery.isLoading}
          />
        )}

        {/* 7. Link to Contact */}
        <SearchableSinglePicker
          label="Link to Contact"
          options={contactOptions}
          selectedId={contactId}
          onChange={handleContactChange}
          placeholder="Search contacts..."
          isLoading={contactsQuery.isLoading}
        />

        {/* 8. Footer: Mark as done + Cancel + Save */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={markAsDone}
              onCheckedChange={(checked) => setMarkAsDone(checked === true)}
            />
            <label className="text-sm text-gray-600">Mark as done</label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} isLoading={isSaving}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ActivityFormModal;
