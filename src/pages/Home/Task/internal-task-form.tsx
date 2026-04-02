import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import useAvailableAssignees from "@/hooks/project-modules/tasks/use-available-assignees";
import useCreateProjectTask from "@/hooks/project-modules/tasks/use-create-project-task";
import useCreateStandaloneTask from "@/hooks/project-modules/tasks/use-create-standalone-task";
import { taskStatuses } from "@/lib/constants";
import { cn, getSelectableDate, getUTCISODateFormat } from "@/lib/utils";
import { TaskCategory, TaskCategoryType } from "@/types/task.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { CalendarIcon, Check, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

const INTERNAL_CATEGORY_OPTIONS = [
  { label: "Review", value: TaskCategoryType.REVIEW },
  { label: "Approval", value: TaskCategoryType.APPROVAL },
  { label: "Meeting", value: TaskCategoryType.MEETING },
  { label: "Follow Up", value: TaskCategoryType.FOLLOW_UP },
];

const internalTaskSchema = yup.object({
  name: yup.string().optional(),
  project_type_id: yup.string().optional(),
  project_id: yup.string().optional(),
  status: yup.string().required("Status is required"),
  end_date: yup.date().required("End date is required"),
  assignees: yup.array().of(yup.string().required()).min(1, "At least one assignee is required").required("Assignees are required"),
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
  const backPath = getReturnPath();
  const form = useForm<InternalFormData>({
    resolver: yupResolver(internalTaskSchema),
    defaultValues: {
      project_id: initialProjectId || undefined,
      project_type_id: initialProjectTypeId || undefined,
    },
  });
  const selectedProjectId = initialProjectId;
  const assigneesQuery = useAvailableAssignees(selectedProjectId, "internal");
  const companyUsersQuery = useGetCompanyUsers();
  const createTask = useCreateProjectTask(selectedProjectId);
  const createStandaloneTask = useCreateStandaloneTask();
  const assigneeOptions = useMemo(() => {
    if (selectedProjectId) {
      const list = extractList(assigneesQuery?.value);
      return list.map((u: any) => ({ id: u.id, label: u.name || u.email || "Unknown" }));
    }
    const users = companyUsersQuery?.value?.data ?? [];
    return users.map((u: any) => ({ id: u.id, label: u.name || u.email || "Unknown" }));
  }, [selectedProjectId, assigneesQuery?.value, companyUsersQuery?.value]);
  const onSubmit = async (data: InternalFormData) => {
    const { end_date, task_category_type, form_config, ...rest } = data;
    const payload: Record<string, any> = {
      ...rest, task_category: TaskCategory.INTERNAL,
      due_date: getUTCISODateFormat(end_date),
      is_visible_to_client: false,
    };
    if (task_category_type) payload.task_category_type = task_category_type;
    if (form_config && Object.keys(form_config).length > 0) payload.form_config = form_config;
    const isStandalone = !data.project_type_id && !data.project_id;
    try {
      if (isStandalone) {
        payload.project_id = null;
        payload.project_type_id = null;
        await createStandaloneTask.mutateAsync(payload as any);
      } else {
        await createTask.mutateAsync(payload as any);
      }
      navigate(cancelPath);
    } catch (error) { console.error(error); }
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

            <FormField control={form.control} name="task_category_type" render={({ field }) => (
              <FormItem><FormLabel>Task category type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl className="h-12 w-full">
                    <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                      <SelectValue placeholder={<p className="text-brand-placeholder">Select category type (optional)</p>} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{INTERNAL_CATEGORY_OPTIONS.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}</SelectContent>
                </Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="end_date" render={({ field }) => (
                <FormItem className="flex flex-col w-full"><FormLabel isRequired>Due date</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                    <Button variant="outline" className={cn("font-normal h-12 rounded-full border-brand-border border bg-transparent px-3 py-4 text-sm", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span className="text-brand-placeholder">Due date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={getSelectableDate} initialFocus />
                    </PopoverContent></Popover><FormMessage /></FormItem>
              )} />
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
              placeholder={!selectedProjectId ? "Search company members..." : "Search team members..."}
              error={form.formState.errors.assignees?.message} />
            <div className="flex justify-end gap-3 mt-4 mb-8">
              <Button variant="outline" type="button" onClick={() => navigate(cancelPath)}>Cancel</Button>
              <Button type="submit" isLoading={createTask.isPending || createStandaloneTask.isPending}>Create Task</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InternalTaskForm;