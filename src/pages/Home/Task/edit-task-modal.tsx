import Modal from "@/components/Modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import Loader from "@/components/ui/loader";
import MultiSelect from "@/components/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TaskStatusBadge } from "@/components/ui/task-status-badge";
import { Textarea } from "@/components/ui/textarea";
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetAllTaskTypes from "@/hooks/project-modules/task-types/use-get-all-task-types";
import useUpdateProjectTask from "@/hooks/project-modules/tasks/use-update-project-task";
import useUpdateTaskStatus from "@/hooks/project-modules/tasks/use-update-task-status";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import { taskStatuses } from "@/lib/constants";
import { getValidNextStatuses } from "@/lib/task-transitions";
import getInitials, {
    cn,
    fileToBase64,
    getSelectableDate,
    getUTCISODateFormat,
    truncateMiddleWords,
} from "@/lib/utils";
import { Task } from "@/types/task.types";
import { taskFormSchema } from "@/utils/validation-schema/task";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { CalendarIcon, File, Trash, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import TaskActivityTimeline from "./task-activity-timeline";
import TaskComments from "./task-comments";
interface ViewEditTaskModalProps {
  onClose: () => void;
  isOpen: boolean;
  taskData: Task;
  mode: "view" | "edit";
}

type TaskFormData = yup.InferType<typeof taskFormSchema>;

const ViewEditTaskModal = ({
  onClose,
  isOpen,
  taskData,
  mode,
}: ViewEditTaskModalProps) => {
  const taskTypes = useGetAllTaskTypes();
  const projectTypes = useGetAllProjectTypes();
  const users = useGetCompanyUsers();

  const isViewMode = mode === "view";

  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<string[]>([]);

  const form = useForm<TaskFormData>({
    resolver: yupResolver(taskFormSchema),
    defaultValues: {
      name: taskData.name,
      task_type_id: taskData.task_type_id,
      project_type_id: taskData.project_type_id,
      project_id: taskData.project_id,
      description: taskData.description,
      status: taskData.status,
      start_date: new Date(taskData.start_date),
      end_date: new Date(taskData.end_date),
      is_visible_to_client: Boolean(taskData.is_visible_to_client),
      assignees: taskData.assignees.map((assignee) => assignee.id),
      attachment: [],
    },
  });

  // Watch project_type_id to fetch related projects
  const selectedProjectTypeId = form.watch("project_type_id");
  const projects = useGetAllProjects(selectedProjectTypeId);

  // Watch project_id to determine which updateTask hook to use
  const selectedProjectId = form.watch("project_id");
  const updateTask = useUpdateProjectTask(selectedProjectId, taskData?.id || "");
  const updateStatus = useUpdateTaskStatus(taskData.project_id, taskData.id);
  const validNextStatuses = getValidNextStatuses(taskData.status);

  const isLoading =
    taskTypes.isLoading ||
    projects.isLoading ||
    projectTypes.isLoading ||
    users.isLoading;

  const handleRemoveExistingAttachment = (attachmentId: string) => {
    setDeletedAttachmentIds((prev) => [...prev, attachmentId]);
  };

  const handleDownloadAttachment = (mediaUrl: string) => {
    window.open(mediaUrl, "_blank");
  };

  const onSubmit = async (data: TaskFormData) => {
    if (isViewMode) return;

    const { end_date, start_date, attachment, ...validData } = data;

    // Ensure attachment is an array before processing
    const newAttachments = Array.isArray(attachment) ? attachment : [];

    // Convert each file to base64 and wait for all to finish
    const base64FileList = await Promise.all(
      newAttachments.map(async (item: File) => {
        try {
          return await fileToBase64(item);
        } catch (err) {
          console.error("Error converting file:", err);
          return null;
        }
      })
    );

    // Get existing attachments that haven't been deleted
    const existingAttachments = taskData.document?.[0]?.attachments || [];
    const remainingExistingAttachments = existingAttachments.filter(
      (attachment) => !deletedAttachmentIds.includes(attachment.id)
    );

    // Combine new base64 files with remaining existing attachment IDs
    const allAttachments = [
      ...base64FileList.filter((file): file is string => file !== null),
      ...remainingExistingAttachments.map((att) => att.media_url),
    ];

    const payload = {
      ...validData,
      start_date: getUTCISODateFormat(start_date),
      end_date: getUTCISODateFormat(end_date),
      attachments: allAttachments,
    };

    try {
      await updateTask.mutateAsync(payload);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  // Get existing attachments from API data and filter deleted ones
  const existingAttachments = (taskData.document?.[0]?.attachments || []).filter(
    (attachment) => !deletedAttachmentIds.includes(attachment.id)
  );

  return (
    <Modal
      title={isViewMode ? "View Task" : "Edit Task"}
      closeModal={onClose}
      isOpen={isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      {isLoading ? (
        <div className="min-h-[calc(100vh-70px)] flex items-center">
          <Loader />
        </div>
      ) : (
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
                  <FormLabel isRequired>Task name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Task name"
                      {...field}
                      value={field.value ?? ""}
                      disabled={isViewMode}
                    />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isViewMode}
                  >
                    <FormControl className="h-12 w-full">
                      <SelectTrigger
                        isLoading={taskTypes.isLoading}
                        className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                        disabled={isViewMode}
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
                      if (!isViewMode) {
                        field.onChange(value);
                        form.setValue("project_id", "");
                      }
                    }}
                    defaultValue={field.value}
                    disabled={isViewMode}
                  >
                    <FormControl className="h-12 w-full">
                      <SelectTrigger
                        isLoading={projectTypes.isLoading}
                        className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                        disabled={isViewMode}
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
                    disabled={isViewMode || !selectedProjectTypeId}
                  >
                    <FormControl className="h-12 w-full">
                      <SelectTrigger
                        isLoading={projects.isLoading}
                        className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                        disabled={isViewMode || !selectedProjectTypeId}
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
                    <Textarea
                      placeholder="Description"
                      {...field}
                      disabled={isViewMode}
                    />
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
                            disabled={isViewMode}
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
                      {!isViewMode && (
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={getSelectableDate}
                            initialFocus
                          />
                        </PopoverContent>
                      )}
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
                            disabled={isViewMode}
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
                      {!isViewMode && (
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
                      )}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isViewMode}
                  >
                    <FormControl className="h-12 w-full">
                      <SelectTrigger
                        className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                        disabled={isViewMode}
                      >
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
                const selectedIds = Array.isArray(field.value) ? field.value : [];

                return (
                  <FormItem>
                    <FormLabel isRequired>Assignee</FormLabel>
                    <FormControl>
                      <div>
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
                            if (!isViewMode) {
                              field.onChange(selectedValues);
                            }
                          }}
                          placeholder="Assign to"
                          disabled={isViewMode || users.isPending}
                        />
                        {isViewMode && field.value?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {taskData?.assignees?.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center bg-gray-200 rounded-full px-3 py-1"
                              >
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback className="text-xs">
                                    {getInitials(user.name || user.email)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{user.name || user.email}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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
                    {isViewMode ? (
                      <div className="space-y-2">
                        {existingAttachments.length > 0 ? (
                          existingAttachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="p-4 border border-brand-border bg-white rounded-lg flex justify-between"
                            >
                              <div className="flex gap-2 items-center">
                                <File className="h-5" />
                                <p className="font-sm">
                                  {truncateMiddleWords(attachment.media_url)}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDownloadAttachment(attachment.media_url)
                                  }
                                >
                                  <Upload className="h-5" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 border border-brand-border bg-gray-50 rounded-lg text-center text-gray-500">
                            No attachments
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <DragNdrop
                          id="file-attachment"
                          value={field.value}
                          onChange={field.onChange}
                        />
                        {existingAttachments.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {existingAttachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="p-4 border border-brand-border bg-white rounded-lg flex justify-between"
                              >
                                <div className="flex gap-2 items-center">
                                  <File className="h-5" />
                                  <p className="font-sm">
                                    {truncateMiddleWords(attachment.media_url)}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDownloadAttachment(attachment.media_url)
                                    }
                                  >
                                    <Upload className="h-5" />
                                  </Button>
                                  <Separator orientation="vertical" />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      handleRemoveExistingAttachment(attachment.id)
                                    }
                                  >
                                    <Trash className="h-5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
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
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-[#00000099]">
                    Make visible to client
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Status Badge & Transition */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Current status:</span>
                <TaskStatusBadge
                  status={taskData.status}
                  signingStatus={taskData.signing_status}
                />
              </div>
              {validNextStatuses.length > 0 && !isViewMode && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Transition to:</span>
                  {validNextStatuses.map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={updateStatus.isPending}
                      onClick={async () => {
                        try {
                          await updateStatus.mutateAsync({ status: s });
                          onClose();
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      {taskStatuses.find((ts) => ts.value === s)?.label ?? s}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Comments */}
            <TaskComments projectId={taskData.project_id} taskId={taskData.id} />

            <Separator />

            {/* Activity Timeline */}
            <TaskActivityTimeline projectId={taskData.project_id} taskId={taskData.id} />

            {!isViewMode && (
              <Button type="submit" isLoading={updateTask.isPending} className="w-full">
                Update Task
              </Button>
            )}
          </form>
        </Form>
      )}
    </Modal>
  );
};

export default ViewEditTaskModal;
