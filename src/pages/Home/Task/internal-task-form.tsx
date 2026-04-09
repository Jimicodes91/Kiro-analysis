import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import useGetCompanyContacts from "@/hooks/contacts/use-get-company-contact";
import useAvailableAssignees from "@/hooks/project-modules/tasks/use-available-assignees";
import useCreateProjectTask from "@/hooks/project-modules/tasks/use-create-project-task";
import useCreateStandaloneTask from "@/hooks/project-modules/tasks/use-create-standalone-task";
import useGetAllCompanyProjects from "@/hooks/project-modules/use-get-all-company-projects";
import { cn, getSelectableDate, getUTCISODateFormat } from "@/lib/utils";
import { TaskCategory, TaskCategoryType } from "@/types/task.types";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Check, ClipboardList, Handshake, Phone, Search, ThumbsUp, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";

const CATEGORY_ICONS = [
  { type: TaskCategoryType.REVIEW, label: "Review", icon: ClipboardList },
  { type: TaskCategoryType.APPROVAL, label: "Approval", icon: ThumbsUp },
  { type: TaskCategoryType.MEETING, label: "Meeting", icon: Handshake },
  { type: TaskCategoryType.FOLLOW_UP, label: "Follow-up", icon: Phone },
] as const;

function extractList(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  if (raw?.data?.data && Array.isArray(raw.data.data)) return raw.data.data;
  return [];
}

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
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()) || (o.sublabel && o.sublabel.toLowerCase().includes(search.toLowerCase())));
  const selected = options.find((o) => o.id === selectedId);
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1" ref={ref}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder={placeholder ?? "Search..."} value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setIsOpen(true)} className="w-full h-10 pl-9 pr-3 rounded-full border border-brand-border bg-transparent text-sm placeholder:text-brand-placeholder focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {isLoading && <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>}
            {!isLoading && filtered.length === 0 && <p className="px-3 py-2 text-sm text-gray-500">No results found</p>}
            {!isLoading && filtered.map((opt) => (
              <div key={opt.id} className="flex items-center px-3 py-2 text-sm hover:bg-[#E0EFDE4D] cursor-pointer" onClick={() => { onChange(opt.id); setSearch(""); setIsOpen(false); }}>
                <span className="flex-1">{opt.label}{opt.sublabel && <span className="text-gray-400 ml-1 text-xs">{opt.sublabel}</span>}</span>
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
            <button type="button" onClick={() => onChange(null)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
          </span>
        </div>
      )}
    </div>
  );
}

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
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  const toggle = (id: string) => { onChange(selectedIds.includes(id) ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]); };
  const selectedItems = selectedIds.map((id) => options.find((o) => o.id === id)).filter(Boolean) as { id: string; label: string }[];
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="relative mt-1" ref={ref}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder={placeholder ?? "Search..."} value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setIsOpen(true)} className="w-full h-10 pl-9 pr-3 rounded-full border border-brand-border bg-transparent text-sm placeholder:text-brand-placeholder focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filtered.length === 0 && <p className="px-3 py-2 text-sm text-gray-500">No results found</p>}
            {filtered.map((opt) => {
              const isSel = selectedIds.includes(opt.id);
              return (
                <div key={opt.id} className="flex items-center px-3 py-2 text-sm hover:bg-[#E0EFDE4D] cursor-pointer" onClick={() => toggle(opt.id)}>
                  <span className="flex-1">{opt.label}</span>
                  <div className={cn("flex items-center justify-center w-[18px] h-[18px] border rounded", isSel ? "bg-black border-black" : "border-gray-500")}>
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
            <span key={item.id} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F3F3] rounded-full text-sm">
              {item.label}
              <button type="button" onClick={() => toggle(item.id)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const InternalTaskForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get("projectId") ?? "";
  const initialProjectTypeId = searchParams.get("projectTypeId") ?? "";
  const from = searchParams.get("from") ?? "";
  const getReturnPath = () => {
    if (from === "admin") return "/admin?selectedTab=task";
    if (from.startsWith("project:")) return `/projects/${from.split(":")[1]}`;
    return "/task";
  };
  const cancelPath = getReturnPath();
  const backPath = getReturnPath();

  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState<TaskCategoryType | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string | null>(initialProjectId || null);
  const [contactIds, setContactIds] = useState<string[]>([]);
  const [markAsDone, setMarkAsDone] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const selectedProjectId = initialProjectId;
  const assigneesQuery = useAvailableAssignees(selectedProjectId, "internal");
  const clientsQuery = useAvailableAssignees(selectedProjectId, "external");
  const companyUsersQuery = useGetCompanyUsers();
  const contactsQuery = useGetCompanyContacts();
  const projectsQuery = useGetAllCompanyProjects();
  const createTask = useCreateProjectTask(projectId ?? selectedProjectId ?? "");
  const createStandaloneTask = useCreateStandaloneTask();

  const assigneeOptions = useMemo(() => {
    if (selectedProjectId) {
      const list = extractList(assigneesQuery?.value);
      return list.map((u: any) => ({ id: u.id, label: u.name || u.email || "Unknown" }));
    }
    const users = companyUsersQuery?.value?.data ?? [];
    return users.filter((u: any) => (u.role || "").toLowerCase() !== "client").map((u: any) => ({ id: u.id, label: u.name || u.email || "Unknown" }));
  }, [selectedProjectId, assigneesQuery?.value, companyUsersQuery?.value]);

  const projectOptions = useMemo(() => {
    const projects = projectsQuery?.value?.data ?? [];
    return projects.map((p: any) => ({ id: p.id, label: p.name, projectTypeId: p.project_type_id }));
  }, [projectsQuery?.value]);

  const contactOptions = useMemo(() => {
    // When in project context, show only project's clients
    if (selectedProjectId) {
      const list = extractList(clientsQuery?.value);
      return list.map((c: any) => ({ id: c.id, label: c.name || c.email || "Unknown" }));
    }
    // Standalone: show all company contacts
    const contacts = contactsQuery?.value?.data?.contacts ?? [];
    return contacts.map((c: any) => ({ id: c.id, label: c.name || c.email || "Unknown" }));
  }, [selectedProjectId, clientsQuery?.value, contactsQuery?.value]);

  const handleContactChange = (ids: string[]) => {
    setContactIds(ids);
    // Auto-populate subject with first selected contact's name if subject is empty
    if (ids.length > 0 && !name.trim()) {
      const contact = contactOptions.find((c: any) => c.id === ids[0]);
      if (contact) setName(contact.label);
    }
  };

  const hasProjectFromUrl = !!initialProjectId;
  const projectName = useMemo(() => {
    if (!initialProjectId) return "";
    const proj = projectOptions.find((p: any) => p.id === initialProjectId);
    return proj?.label ?? "Linked Project";
  }, [initialProjectId, projectOptions]);

  const handleSave = async () => {
    if (!dueDate || assignees.length === 0) return;
    const payload: Record<string, any> = {
      name: name || "Untitled Task",
      task_category: TaskCategory.INTERNAL,
      is_visible_to_client: false,
      status: markAsDone ? "completed" : "draft",
      due_date: getUTCISODateFormat(dueDate),
      assignees,
    };
    if (categoryType) payload.task_category_type = categoryType;
    if (contactIds.length > 0) payload.contact_id = contactIds[0];
    const isStandalone = !initialProjectTypeId && !projectId;
    try {
      let result: any;
      if (isStandalone) {
        result = await createStandaloneTask.mutateAsync(payload as any);
      } else {
        const typeId = initialProjectTypeId
          || projectOptions.find((p: any) => p.id === (projectId || selectedProjectId))?.projectTypeId;
        if (typeId) payload.project_type_id = typeId;
        result = await createTask.mutateAsync(payload as any);
      }
      const taskId = result?.data?.data?.task_id;
      if (notes.trim() && taskId) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
        const effectiveProjectId = projectId || selectedProjectId;
        const commentEndpoint = isStandalone ? `${baseUrl}/tasks/${taskId}/comments` : `${baseUrl}/projects/${effectiveProjectId}/tasks/${taskId}/comments`;
        try { await axios.post(commentEndpoint, { content: notes.trim() }); } catch (e) { console.error("Failed to post comment:", e); }
      }
      navigate(cancelPath);
    } catch (error) { console.error("Failed to create task:", error); }
  };

  const isSaving = createTask.isPending || createStandaloneTask.isPending;
  const canSubmit = !!dueDate && assignees.length > 0;

  return (
    <div className="p-3 sm:p-4 md:p-6 my-2">
      <div className="flex items-center gap-4 my-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}><IoArrowBack className="w-5 h-5" /></Button>
        <Heading size="h3">Create Internal Task</Heading>
      </div>
      <div className="max-w-2xl mx-auto mt-4">
        <div className="flex flex-col gap-4">
          <Input placeholder="Task subject..." value={name} onChange={(e) => setName(e.target.value)} className="text-lg font-medium h-12 border-brand-border rounded-full" />
          <div>
            <label className="text-sm font-medium">Category</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {CATEGORY_ICONS.map(({ type, label, icon: Icon }) => (
                <button key={type} type="button" onClick={() => setCategoryType(type)} className={cn("flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs transition-colors", categoryType === type ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400 text-gray-600")} title={label}>
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Due date <span className="text-red-500">*</span></label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full font-normal h-10 rounded-full border-brand-border border bg-transparent px-3 text-sm mt-1", !dueDate && "text-muted-foreground")}>
                  {dueDate ? format(dueDate, "PPP") : <span className="text-brand-placeholder">Select due date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dueDate ?? undefined} onSelect={(date) => { setDueDate(date ?? null); setDatePickerOpen(false); }} disabled={getSelectableDate} />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea placeholder="Add notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 min-h-[80px] rounded-xl border-brand-border" />
          </div>
          <SearchableMultiPicker label="Assigned to" options={assigneeOptions} selectedIds={assignees} onChange={setAssignees} placeholder={!selectedProjectId ? "Search company members..." : "Search team members..."} />
          {hasProjectFromUrl ? (
            <div>
              <label className="text-sm font-medium">Project</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F3F3] rounded-full text-sm">{projectName}</span>
              </div>
            </div>
          ) : (
            <SearchableSinglePicker label="Link to Project" options={projectOptions} selectedId={projectId} onChange={setProjectId} placeholder="Search projects..." isLoading={projectsQuery.isLoading} />
          )}
          <SearchableMultiPicker label="Link to Contact" options={contactOptions} selectedIds={contactIds} onChange={handleContactChange} placeholder="Search contacts..." />
          <div className="flex items-center justify-between pt-2 border-t mb-8">
            <div className="flex items-center gap-2">
              <Checkbox checked={markAsDone} onCheckedChange={(checked) => setMarkAsDone(checked === true)} />
              <label className="text-sm text-gray-600">Mark as done</label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => navigate(cancelPath)} disabled={isSaving}>Cancel</Button>
              <Button type="button" onClick={handleSave} isLoading={isSaving} disabled={!canSubmit}>Create Task</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalTaskForm;