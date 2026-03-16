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
import useGetProjectMembers from "@/hooks/project-modules/project-members/use-get-project-members";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetAllTaskTypes from "@/hooks/project-modules/task-types/use-get-all-task-types";
import useCreateProjectTask from "@/hooks/project-modules/tasks/use-create-project-task";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import { taskStatuses } from "@/lib/constants";
import { cn, fileToBase64, getSelectableDate, getUTCISODateFormat } from "@/lib/utils";
import { taskFormSchema } from "@/utils/validation-schema/task";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface AddTaskModalProps {
  onClose: () => void;
  isOpen: boolean;
}

type TaskFormData = yup.InferType<typeof taskFormSchema>;

const AddTaskModal = ({ onClose, isOpen }: AddTaskModalProps) => {
  const taskTypes = useGetAllTaskTypes();
  const projectTypes = useGetAllProjectTypes();

  const form = useForm<TaskFormData>({
    resolver: yupResolver(taskFormSchema),
  });
  const projectId = form.watch("project_id") ?? [];
  const projectMembers = useGetProjectMembers(projectId);
  // Watch project_type_id to fetch related projects
  const selectedProjectTypeId = form.watch("project_type_id");
  const projects = useGetAllProjects(selectedProjectTypeId);

  // Watch project_id to determine which project_id to pass to the createTask hook
  const selectedProjectId = form.watch("project_id");
  const createTask = useCreateProjectTask(selectedProjectId);

  const onSubmit = async (data: TaskFormData) => {
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
          return null;
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
                <FormLabel isRequired>Task name</FormLabel>
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
                <FormLabel isRequired>Pipeline</FormLabel>
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
                <FormLabel isRequired>Project</FormLabel>
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
                <FormLabel isRequired>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel isRequired>Start date</FormLabel>
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
                  <FormLabel isRequired>End date</FormLabel>
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
                <FormLabel isRequired>Status</FormLabel>
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
                    {taskStatuses?.map((item) => (
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
                  <FormLabel isRequired>Assignee</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={
                        projectMembers?.value
                          ? projectMembers?.value?.data?.map((item) => ({
                              label: item.user?.name ?? item.user?.email,
                              value: item.user_id,
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
                      disabled={projectMembers.isPending}
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
