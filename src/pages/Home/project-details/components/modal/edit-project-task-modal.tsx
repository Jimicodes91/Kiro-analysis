import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomMultiSelect from "@/components/ui/multi-lol";
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
import useGetAllTaskTypes from "@/hooks/project-modules/task-types/use-get-all-task-types";
import useUpdateProjectTask from "@/hooks/project-modules/tasks/use-update-project-task";
import { cn, fileToBase64, getSelectableDate } from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { TaskDetails } from "@/types/api.types";
import { editProjectTaskSchema } from "@/utils/validation-schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../../../../../components/Modal";

const statuses = [
  { value: "in_progress" as const, label: "In Progress" },
  { value: "pending" as const, label: "Pending" },
  { value: "completed" as const, label: "Completed" },
];

const EditProjectTaskModal = ({
  onClose,
  projectId,
  isOpen,
  task,
}: {
  projectId: string;
  task: TaskDetails;
} & ModalProps) => {
  const taskTypes = useGetAllTaskTypes();
  const session = getUserSession();
  const users = useGetCompanyUsers(session?.company_id ?? "");
  const updateTask = useUpdateProjectTask(projectId, task?.id);

  const form = useForm<z.infer<typeof editProjectTaskSchema>>({
    resolver: zodResolver(editProjectTaskSchema),
    defaultValues: {
      name: task.name,
      task_type_id: task.task_type_id,
      description: task.description,
      status: task.status,
      end_date: new Date(task.end_date),
      start_date: new Date(task.start_date),
      is_visible_to_client: task.is_visible_to_client === 1 ? true : false,
      assignees: task?.assignees?.map((item) => ({
        label: item.name ?? item.email,
        value: item.id,
      })),
    },
  });

  const onSubmit = async (data: z.infer<typeof editProjectTaskSchema>) => {
    const { assignees, end_date, start_date, attachment, ...validData } = data;
    let base64File = "";

    if (attachment) {
      try {
        const base64String = await fileToBase64(attachment);
        base64File = base64String;
      } catch (err) {
        console.error("Error converting file:", err);
      }
    }
    console.log(base64File);
    const assigneesIds = assignees?.map((item) => item.value);

    updateTask
      .mutateAsync({
        ...validData,
        start_date: formatISO(start_date),
        end_date: formatISO(end_date),
        assignees: assigneesIds,
      })
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal
        title="Edit task"
        closeModal={onClose}
        isOpen={isOpen}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task name</FormLabel>
                  <FormControl>
                    <Input placeholder="Task name" {...field} />
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
                          disabled={(date) => date < new Date(form.watch("start_date"))}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <CustomMultiSelect
                    options={
                      users?.value
                        ? users?.value?.data?.map((item) => ({
                            label: item.name ?? item.email,
                            value: item.id,
                          }))
                        : []
                    }
                    isLoading={users.isPending}
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="Select Assignee"
                    isMulti
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
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
            /> */}

            <FormField
              control={form.control}
              name="is_visible_to_client"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal text-brand-fade">
                    Make visible to client
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" isLoading={updateTask.isPending}>
              Edit Task
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default EditProjectTaskModal;
