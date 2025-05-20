import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import DragNdrop from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import CustomMultiSelect from "@/components/ui/multi-lol";
import MultiSelect from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetAllTaskTypes from "@/hooks/project-modules/task-types/use-get-all-task-types";
import useCreateProjectTask from "@/hooks/project-modules/tasks/use-create-project-task";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import { cn, fileToBase64, getSelectableDate, getUTCISODateFormat } from "@/lib/utils";

// Status options for the dropdown
const statuses = [
  { value: "in_progress", label: "In Progress" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

// File validation constants
const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 3;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
];

// Validation schema using Yup
const addTaskSchema = yup.object({
  name: yup
    .string()
    .required("Task name is required")
    .min(3, "Task name must be at least 3 characters"),
  task_type_id: yup.string().required("Task type is required"),
  project_type_id: yup.string().required("Pipeline is required"),
  project_id: yup.string().required("Project is required"),
  status: yup
    .string()
    .oneOf(["in_progress", "pending", "completed"], "Invalid status")
    .required("Status is required"),
  description: yup.string().required("Description is required"),
  start_date: yup.date().required("Start date is required"),
  end_date: yup.date().required("End date is required"),
  is_visible_to_client: yup.boolean().default(false),
  assignees: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one assignee is required")
    .required("Assignees are required"),
  attachment: yup
    .array()
    .test("fileSize", "Each file must be less than 5MB", (files) => {
      if (!files || files.length === 0) return true;
      return files.every((file) => file.size <= FILE_SIZE);
    })
    .test("fileType", "Only PDF, PNG, JPG, and DOC files are allowed", (files) => {
      if (!files || files.length === 0) return true;
      return files.every((file) => ALLOWED_FILE_TYPES.includes(file.type));
    })
    .test("maxFiles", `You can upload up to ${MAX_FILES} files`, (files) => {
      if (!files) return true;
      return files.length <= MAX_FILES;
    })
    .required("Attachment is required"),
});

interface AddTaskModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const AddTaskModal = ({ onClose, isOpen }: AddTaskModalProps) => {
  const taskTypes = useGetAllTaskTypes();
  const projectTypes = useGetAllProjectTypes();
  const users = useGetCompanyUsers();

  const form = useForm({
    resolver: yupResolver(addTaskSchema),
    defaultValues: {
      name: "",
      task_type_id: "",
      project_type_id: "",
      project_id: "",
      description: "",
      status: undefined,
      start_date: undefined,
      end_date: undefined,
      is_visible_to_client: false,
      assignees: [],
      attachment: [],
    },
  });

  // Watch project_type_id to fetch related projects
  const selectedProjectTypeId = form.watch("project_type_id");
  const projects = useGetAllProjects(selectedProjectTypeId);

  // Watch project_id to determine which createTask hook to use
  const selectedProjectId = form.watch("project_id");
  const createTask = useCreateProjectTask(selectedProjectId);

  interface FormData {
    name: string;
    task_type_id: string;
    project_type_id: string;
    project_id: string;
    description: string;
    status: string;
    start_date: Date;
    end_date: Date;
    is_visible_to_client: boolean;
    assignees: string[];
    attachment?: File[]; // Made optional
  }

  const onSubmit = async (data: FormData) => {
    const { end_date, start_date, attachment, ...validData } = data;

    // Ensure attachment is an array before processing
    const attachments = Array.isArray(attachment) ? attachment : [];

    // Convert each file to base64 and wait for all to finish
    const base64FileList = await Promise.all(
      attachments.map(async (item: File) => {
        try {
          return await fileToBase64(item);
        } catch (err) {
          console.error("Error converting file:", err);
          return null; // Optional: filter these out later
        }
      })
    );

    const payload = {
      ...validData,
      start_date: getUTCISODateFormat(start_date),
      end_date: getUTCISODateFormat(end_date),
      attachments: base64FileList.filter(Boolean), // Remove nulls
    };

    try {
      await createTask.mutateAsync(payload);
      form.reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="Add Task"
      closeModal={onClose}
      isOpen={isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task name</FormLabel>
                <FormControl>
                  <Input placeholder="Task name" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="task_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="h-12 w-full">
                    <SelectTrigger
                      isLoading={taskTypes.isLoading}
                      className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                    >
                      <SelectValue
                        placeholder={
                          <p className="text-brand-placeholder">Select Task type</p>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taskTypes?.value?.data?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pipeline</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Clear project selection when pipeline changes
                    form.setValue("project_id", "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl className="h-12 w-full">
                    <SelectTrigger
                      isLoading={projectTypes.isLoading}
                      className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                    >
                      <SelectValue
                        placeholder={
                          <p className="text-brand-placeholder">Select Pipeline</p>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectTypes?.value?.data?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedProjectTypeId}
                >
                  <FormControl className="h-12 w-full">
                    <SelectTrigger
                      isLoading={projects.isLoading}
                      className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                    >
                      <SelectValue
                        placeholder={
                          <p className="text-brand-placeholder">
                            {selectedProjectTypeId
                              ? "Select Project"
                              : "Select Pipeline first"}
                          </p>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects?.value?.data
                      ?.filter(
                        (project) => project.project_type_id === selectedProjectTypeId
                      )
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    {projects?.value?.data?.filter(
                      (project) => project.project_type_id === selectedProjectTypeId
                    ).length === 0 && (
                      <div className="px-2 py-2 text-center text-[#00000099]">
                        No projects found for this pipeline
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 justify-between">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Start date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "text-sm h-12 font-normal rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4",
                            !field.value && "text-muted-foreground"
                          )}
                          slotClassName="justify-start"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-brand-placeholder">Start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={getSelectableDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>End date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "font-normal h-12 rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-brand-placeholder">End date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          !form.watch("start_date") ||
                          date < new Date(form.watch("start_date"))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="h-12 w-full">
                    <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                      <SelectValue
                        placeholder={
                          <p className="text-brand-placeholder">Select status</p>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses?.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignees"
            render={({ field }) => {
              // Extract IDs for MultiSelect component
              const selectedIds = Array.isArray(field.value) ? field.value : [];

              return (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={
                        users?.value
                          ? users?.value?.data?.map((item) => ({
                              label: item.name ?? item.email,
                              value: item.id,
                            }))
                          : []
                      }
                      defaultSelected={selectedIds}
                      onChange={(selectedValues) => {
                        // Just pass the array of strings directly to the form
                        field.onChange(selectedValues);
                      }}
                      placeholder="Select Assignee"
                      //   error={fieldState.error?.message}
                      disabled={users.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name={"attachment"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachment</FormLabel>
                <FormControl>
                  <DragNdrop
                    id="file-attachment"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_visible_to_client"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal text-[#00000099]">
                  Make visible to client
                </FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" isLoading={createTask.isPending} className="w-full">
            Save and continue
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default AddTaskModal;
