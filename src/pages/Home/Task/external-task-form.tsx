import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn, getSelectableDate, getUTCISODateFormat } from "@/lib/utils";
import { TaskCategory } from "@/types/task.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { CalendarIcon, Check, Search, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

const externalTaskSchema = yup.object({
  name: yup.string().required("Task name is required").min(3, "Task name must be at least 3 characters"),
  project_type_id: yup.string().required("Pipeline is required"),
  project_id: yup.string().required("Project is required"),
  description: yup.string().max(5000).optional(),
  end_date: yup.date().required("Due date is required"),
  client_ids: yup.array().of(yup.string().required()).min(1, "At least one client is required").required("Clients are required"),
});

type ExternalFormData = yup.InferType<typeof externalTaskSchema>;

function extractList(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  if (raw?.data?.data && Array.isArray(raw.data.data)) return raw.data.data;
  return [];
}

const SearchableMultiPicker = ({ label, options, selectedIds, onChange, placeholder, disabled, error }: {
  label: string; options: { id: string; label: string }[]; selectedIds: string[];
  onChange: (ids: string[]) => void; placeholder?: string; disabled?: boolean; error?: string;
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
          <input type="text" placeholder={disabled ? "Select a project first" : (placeholder ?? "Search...")} value={search}
            onChange={(e) => setSearch(e.target.value)} onFocus={() => !disabled && setIsOpen(true)} disabled={disabled}
            className={cn("w-full h-12 pl-9 pr-3 rounded-full border border-brand-border bg-transparent text-sm placeholder:text-brand-placeholder focus:outline-none focus:ring-2 focus:ring-ring", disabled && "opacity-50 cursor-not-allowed")} />
        </div>
        {isOpen && !disabled && (
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

const ExternalTaskForm = () => {
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
  const [requiredInfo, setRequiredInfo] = useState<string[]>([]);
  const [infoInput, setInfoInput] = useState("");
  const projectTypes = useGetAllProjectTypes();
  const form = useForm<ExternalFormData>({
    resolver: yupResolver(externalTaskSchema),
    defaultValues: {
      project_id: initialProjectId || undefined,
      project_type_id: initialProjectTypeId || undefined,
    },
  });
  const selectedProjectTypeId = form.watch("project_type_id");
  const projects = useGetAllProjects(selectedProjectTypeId);
  const selectedProjectId = form.watch("project_id") ?? "";
  const clientsQuery = useAvailableAssignees(selectedProjectId, "external");
  const createTask = useCreateProjectTask(selectedProjectId);
  const clientOptions = useMemo(() => {
    const list = extractList(clientsQuery?.value);
    return list.map((c: any) => ({ id: c.id, label: c.name || c.email || "Unknown" }));
  }, [clientsQuery?.value]);
  const addInfoItem = () => {
    const trimmed = infoInput.trim();
    if (trimmed && !requiredInfo.includes(trimmed)) { setRequiredInfo([...requiredInfo, trimmed]); setInfoInput(""); }
  };
  const removeInfoItem = (index: number) => {
    setRequiredInfo(requiredInfo.filter((_: string, i: number) => i !== index));
  };
  const onSubmit = async (data: ExternalFormData) => {
    if (requiredInfo.length === 0) return;
    const { end_date, ...rest } = data;
    const payload = {
      ...rest, task_category: TaskCategory.EXTERNAL,
      end_date: getUTCISODateFormat(end_date),
      required_information: requiredInfo, is_visible_to_client: true,
    };
    try { await createTask.mutateAsync(payload as any); navigate(cancelPath); } catch (error) { console.error(error); }
  };

  return (
    <div className="mx-3 sm:mx-4 md:mx-6 my-2">
      <div className="flex items-center gap-4 my-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}><IoArrowBack className="w-5 h-5" /></Button>
        <Heading size="h3">Create External Task</Heading>
      </div>
      <div className="max-w-2xl mx-auto mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel isRequired>Task name</FormLabel>
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
            <FormField control={form.control} name="end_date" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel isRequired>Due date</FormLabel>
                <Popover><PopoverTrigger asChild><FormControl>
                  <Button variant="outline" className={cn("font-normal h-12 rounded-full border-brand-border border bg-transparent px-3 py-4 text-sm", !field.value && "text-muted-foreground")}>
                    {field.value ? format(field.value, "PPP") : <span className="text-brand-placeholder">Due date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button></FormControl></PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={getSelectableDate} initialFocus />
                  </PopoverContent></Popover><FormMessage /></FormItem>
            )} />
            <SearchableMultiPicker label="Assign to Clients" options={clientOptions}
              selectedIds={form.watch("client_ids") ?? []}
              onChange={(vals) => form.setValue("client_ids", vals, { shouldValidate: true })}
              placeholder="Search clients..." disabled={!selectedProjectId || clientsQuery.isLoading}
              error={form.formState.errors.client_ids?.message} />
            <div>
              <label className="text-sm font-medium">Required Information <span className="text-red-500">*</span></label>
              <p className="text-xs text-[#00000080] mb-2">Add items that clients need to provide (at least 1 required)</p>
              <div className="flex gap-2">
                <Input placeholder="e.g. Proof of address, Bank statement" value={infoInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInfoInput(e.target.value)} onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); addInfoItem(); } }} />
                <Button type="button" variant="outline" onClick={addInfoItem}>Add</Button>
              </div>
              {requiredInfo.length === 0 && form.formState.isSubmitted && (
                <p className="text-sm text-red-500 mt-1">At least one required information item is needed</p>
              )}
              {requiredInfo.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {requiredInfo.map((item: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F3F3] rounded-full text-sm">
                      {item}<button type="button" onClick={() => removeInfoItem(idx)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                    </span>))}
                </div>)}
            </div>
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

export default ExternalTaskForm;
