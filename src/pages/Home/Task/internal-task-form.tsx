import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import DragNdrop from "@/components/ui/file-upload";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useAvailableAssignees from "@/hooks/project-modules/tasks/use-available-assignees";
import useCreateProjectTask from "@/hooks/project-modules/tasks/use-create-project-task";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import { taskStatuses } from "@/lib/constants";
import { cn, fileToBase64, getSelectableDate, getUTCISODateFormat } from "@/lib/utils";
import { TaskCategory } from "@/types/task.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { CalendarIcon, Check, Search, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

const internalTaskSchema = yup.object({
  name: yup.string().optional(),
  project_type_id: yup.string().required("Pipeline is required"),
  project_id: yup.string().required("Project is required"),
  status: yup.string().required("Status is required"),
  description: yup.string().max(5000).optional(),
  start_date: yup.date().required("Start date is required"),
  end_date: yup.date().required("End date is required"),
  assignees: yup.array().of(yup.string().required()).min(1, "At least one assignee is required").required("Assignees are required"),
  attachment: yup.array().optional(),
  task_category_type: yup.string().optional(),
  form_config: yup.object().optional(),
});

type InternalFormData = yup.InferType<typeof internalTaskSchema>;

function extractList(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  if (raw?.data?.data && Array.isArray(raw.data.data)) return raw.data.data;
  return [];
}

const SearchableMultiPicker = ({ label, options, selectedIds, onChange, placeholder, error }: {
  label: string; options: { id: string; label: string }[]; selectedIds: string[];
  onChange: (ids: string[]) => void; placeholder?: string; error?: string;
}) => {
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
  const selectedItems = selectedIds.map((id) => options.find((o) => o.id === id)).filter(Boolean) as { id: string; label: string }[];
  return (
    <div>
      <label className="text-sm font-medium">{label} <span className="text-red-500">*</span></label>
      <div className="relative mt-1" ref={ref}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder={placeholder ?? "Search..."} value={search}
            onChange={(e) => setSearch(e.target.value)} onFocus={() => setIsOpen(true)}
            className="w-full h-12 pl-9 pr-3 rounded-full border border-brand-border bg-transparent text-sm placeholder:text-brand-placeholder focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filtered.length === 0 && <p className="px-3 py-2 text-sm text-gray-500">No results found</p>}
            {filtered.map((opt) => {
              const selected = selectedIds.includes(opt.id);
              return (
                <div key={opt.id} className="flex items-center px-3 py-2 text-sm hover:bg-[#E0EFDE4D] cursor-pointer" onClick={() => toggle(opt.id)}>
                  <span className="flex-1">{opt.label}</span>
                  <div className={cn("flex items-center justify-center w-[18px] h-[18px] border rounded", selected ? "bg-black border-black" : "border-gray-500")}>
                    {selected && <Check className="text-white w-[14px] h-[14px]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedItems.map((item) => (
            <span key={item.id} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F3F3] rounded-full text-sm">
              {item.label}
              <button type="button" onClick={() => toggle(item.id)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

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
  const backPath = from ? `/task/new?from=${from}${initialProjectId ? `&projectId=${initialProjectId}` : ""}${initialProjectTypeId ? `&projectTypeId=${initialProjectTypeId}` : ""}` : "/task/new";
  const [additionalInfo, setAdditionalInfo] = useState<string[]>([]);
  const [infoInput, setInfoInput] = useState("");
  const projectTypes = useGetAllProjectTypes();
  const form = useForm<InternalFormData>({
    resolver: yupResolver(internalTaskSchema),
    defaultValues: {
      project_id: initialProjectId || undefined,
      project_type_id: initialProjectTypeId || undefined,
    },
  });
  const selectedProjectTypeId = form.watch("project_type_id");
  const projects = useGetAllProjects(selectedProjectTypeId);
  const selectedProjectId = form.watch("project_id") ?? "";
  const assigneesQuery = useAvailableAssignees(selectedProjectId, "internal");
  const createTask = useCreateProjectTask(selectedProjectId);
  const assigneeOptions = useMemo(() => {
    const list = extractList(assigneesQuery?.value);
    return list.map((u: any) => ({ id: u.id, label: u.name || u.email || "Unknown" }));
  }, [assigneesQuery?.value]);
  const addInfoItem = () => {
    const trimmed = infoInput.trim();
    if (trimmed && !additionalInfo.includes(trimmed)) { setAdditionalInfo([...additionalInfo, trimmed]); setInfoInput(""); }
  };
  const removeInfoItem = (index: number) => {
    setAdditionalInfo(additionalInfo.filter((_: string, i: number) => i !== index));
  };
  const onSubmit = async (data: InternalFormData) => {
    const { end_date, start_date, attachment, task_category_type, form_config, ...rest } = data;
    const attachments = Array.isArray(attachment) ? attachment : [];
    const base64FileList = await Promise.all(
      attachments.map(async (item: File) => { try { return await fileToBase64(item); } catch { return null; } })
    );
    const payload: Record<string, any> = {
      ...rest, task_category: TaskCategory.INTERNAL,
      start_date: getUTCISODateFormat(start_date), end_date: getUTCISODateFormat(end_date),
      attachments: base64FileList.filter(Boolean),
      additional_info: additionalInfo.length > 0 ? additionalInfo : undefined,
    };
    if (task_category_type) payload.task_category_type = task_category_type;
    if (form_config && Object.keys(form_config).length > 0) payload.form_config = form_config;
    try { await createTask.mutateAsync(payload as any); navigate(cancelPath); } catch (error) { console.error(error); }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 my-2">
      <div className="flex items-center gap-4 my-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}><IoArrowBack className="w-5 h-5" /></Button>
        <Heading size="h3">Create Internal Task</Heading>
      </div>
      <div className="max-w-2xl mx-auto mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Task name (optional)</FormLabel>
                <FormControl><Input placeholder="Task name" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="project_type_id" render={({ field }) => (
              <FormItem><FormLabel isRequired>Pipeline</FormLabel>
                <Select onValueChange={(value: string) => { field.onChange(value); form.setValue("project_id", ""); }} value={field.value}>
                  <FormControl className="h-12 w-full">
                    <SelectTrigger isLoading={projectTypes.isLoading} className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                      <SelectValue placeholder={<p className="text-brand-placeholder">Select Pipeline</p>} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{projectTypes?.value?.data?.map((item: any) => (<SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>))}</SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="project_id" render={({ field }) => (
              <FormItem><FormLabel isRequired>Project</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProjectTypeId}>
                  <FormControl className="h-12 w-full">
                    <SelectTrigger isLoading={projects.isLoading} className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                      <SelectValue placeholder={<p className="text-brand-placeholder">{selectedProjectTypeId ? "Select Project" : "Select Pipeline first"}</p>} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{projects?.value?.data?.filter((p: any) => p.project_type_id === selectedProjectTypeId).map((item: any) => (<SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>))}</SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Description" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="task_category_type" render={({ field }) => (
              <FormItem><FormLabel>Task category type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl className="h-12 w-full">
                    <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                      <SelectValue placeholder={<p className="text-brand-placeholder">Select category type (optional)</p>} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{TASK_CATEGORY_TYPE_OPTIONS.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}</SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
            <TypeFieldsSection control={form.control} categoryType={form.watch("task_category_type")} />
            <div className="flex gap-4 justify-between">
              <FormField control={form.control} name="start_date" render={({ field }) => (
                <FormItem className="flex flex-col w-full"><FormLabel isRequired>Start date</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                    <Button variant="outline" className={cn("text-sm h-12 font-normal rounded-full border-brand-border border bg-transparent px-3 py-4", !field.value && "text-muted-foreground")} slotClassName="justify-start">
                      {field.value ? format(field.value, "PPP") : <span className="text-brand-placeholder">Start date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={getSelectableDate} initialFocus />
                    </PopoverContent></Popover><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="end_date" render={({ field }) => (
                <FormItem className="flex flex-col w-full"><FormLabel isRequired>End date</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                    <Button variant="outline" className={cn("font-normal h-12 rounded-full border-brand-border border bg-transparent px-3 py-4 text-sm", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span className="text-brand-placeholder">End date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date: Date) => !form.watch("start_date") || date < new Date(form.watch("start_date"))} initialFocus />
                    </PopoverContent></Popover><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem><FormLabel isRequired>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="h-12 w-full">
                    <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                      <SelectValue placeholder={<p className="text-brand-placeholder">Select status</p>} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{taskStatuses?.map((item: any) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}</SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
            <SearchableMultiPicker label="Assignees" options={assigneeOptions}
              selectedIds={form.watch("assignees") ?? []}
              onChange={(vals) => form.setValue("assignees", vals, { shouldValidate: true })}
              placeholder={!selectedProjectId ? "Select a project first" : "Search team members..."}
              error={form.formState.errors.assignees?.message} />
            <div>
              <label className="text-sm font-medium">Additional Info (optional)</label>
              <div className="flex gap-2 mt-1">
                <Input placeholder="Add a note or info item" value={infoInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInfoInput(e.target.value)} onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); addInfoItem(); } }} />
                <Button type="button" variant="outline" onClick={addInfoItem}>Add</Button>
              </div>
              {additionalInfo.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {additionalInfo.map((item: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F3F3] rounded-full text-sm">
                      {item}<button type="button" onClick={() => removeInfoItem(idx)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                    </span>))}
                </div>)}
            </div>
            <FormField control={form.control} name="attachment" render={({ field }) => (
              <FormItem><FormLabel>Attachment</FormLabel>
                <FormControl><DragNdrop id="internal-file-attachment" value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end gap-3 mt-4 mb-8">
              <Button variant="outline" type="button" onClick={() => navigate(cancelPath)}>Cancel</Button>
              <Button type="submit" isLoading={createTask.isPending}>Create Task</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InternalTaskForm;