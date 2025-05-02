import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import FileUpload, { AttachmentFile } from "@/components/ui/fileupload";
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
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetAllTaskTypes from "@/hooks/project-modules/task-types/use-get-all-task-types";
import useCreateTask from "@/hooks/project-modules/tasks/use-create-task";
import useUpdateTask from "@/hooks/project-modules/tasks/use-update-task";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import { cn } from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { Task, TaskFormData } from "@/types/task.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view" | "edit";
  task?: Task;
}

const taskSchema = yup.object({
  name: yup.string().required("Task name is required"),
  task_type_id: yup.string().required("Task type is required"),
  project_type_id: yup.string().required("Pipeline is required"),
  project: yup.string().required("Project is required"),
  start_date: yup.string().required("Start Date is required"),
  end_date: yup.string().required("End Date is required"),
  status: yup.string().required("Status is required"),
  description: yup.string().required("Description is required"),
  is_visible_to_client: yup.boolean().default(false),
  assignees: yup.array().of(yup.string().required()).required("Assignee is required"),
  attachments: yup
    .array()
    .of(yup.string().required())
    .required("Attachments are required"),
});

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, mode, task }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedProjectTypeId, setSelectedProjectTypeId] = useState<string>("");
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentFile[]>([]);
  const [formInitialized, setFormInitialized] = useState<boolean>(false);

  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";

  // Get data from hooks
  const session = getUserSession();
  const usersResponse = useGetCompanyUsers(session?.company_id ?? "");
  const projectTypesResponse = useGetAllProjectTypes();
  const taskTypesResponse = useGetAllTaskTypes();
  const projectsResponse = useGetAllProjects(selectedProjectTypeId);
  const addTask = useCreateTask(selectedProjectId);
  const updateTask = useUpdateTask(selectedProjectId, task?.id || "");

  const users = useMemo(() => usersResponse?.value?.data || [], [usersResponse]);
  const projects = useMemo(() => projectsResponse?.value?.data || [], [projectsResponse]);
  const projectTypes = useMemo(
    () => projectTypesResponse?.value?.data || [],
    [projectTypesResponse]
  );
  const taskTypes = useMemo(
    () => taskTypesResponse?.value?.data || [],
    [taskTypesResponse]
  );

  const userOptions = users?.map((user) => ({
    value: user.id,
    label: user.name || user.email,
  }));

  const { control, handleSubmit, setValue, watch, reset } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      name: "",
      task_type_id: "",
      project_type_id: "",
      project: "",
      start_date: "",
      end_date: "",
      status: "",
      description: "",
      is_visible_to_client: false,
      attachments: [],
      assignees: [],
    },
  });

  // Set project ID when project field changes
  const watchedProject = watch("project");
  const watchedProjectType = watch("project_type_id");

  // Set project ID when project field changes

  useEffect(() => {
    if (watchedProject) {
      setSelectedProjectId(watchedProject);
    }
    if (watchedProjectType) {
      setSelectedProjectTypeId(watchedProjectType);
    }
  }, [watchedProject, watchedProjectType, setValue]);

  // Initialize form data from task prop when available
  useEffect(() => {
    if (!task || formInitialized || !(mode === "edit" || mode === "view")) {
      return;
    }

    if (!users.length || !projectTypes.length || !taskTypes.length) {
      return;
    }

    const initializeForm = () => {
      // Set the project type (pipeline) to ensure projects are loaded
      if (task.pipeline?.id) {
        setSelectedProjectTypeId(task.pipeline.id);
        setValue("project_type_id", task.pipeline.id);
      } else {
        setValue("project_type_id", ""); // Fallback to empty if no pipeline ID
      }

      // Small delay to ensure projects are loaded after setting project type
      setTimeout(() => {
        setValue("name", task.name);
        setValue("task_type_id", task.task_type.id || "");
        setValue("project", task.project_id || "");
        setValue("start_date", task.start_date);
        setValue("end_date", task.end_date);

        // Fix status value to match select options
        let statusValue = task.status;
        if (statusValue === "in progress") {
          statusValue = "in_progress";
        }
        setValue("status", statusValue);

        setValue("description", task.description || "");
        setValue("is_visible_to_client", task.is_visible_to_client === 1 || false);

        // Handle assignees
        if (task.assignees && Array.isArray(task.assignees)) {
          const assigneeIds = task.assignees.map((assignee) => assignee.id);
          setValue("assignees", assigneeIds);
        }

        // Handle attachments
        if (task.document && task.document[0]?.attachments) {
          const attachments = task.document[0].attachments.map((attachment) => ({
            name: attachment.media_url.split("/").pop() || "file",
            url: attachment.media_url,
            size: 0,
          }));

          setAttachmentFiles(attachments);
          setValue(
            "attachments",
            attachments.map((a) => a.url)
          );
        }

        setFormInitialized(true);
      }, 100);
    };

    initializeForm();
  }, [
    task,
    mode,
    formInitialized,
    users.length,
    projectTypes.length,
    taskTypes.length,
    setValue,
  ]);
  // Reset form initialization state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormInitialized(false);
      reset();
    }
  }, [isOpen]);

  const handleFormSubmit = async (data: TaskFormData) => {
    if (isViewMode) {
      onClose();
      return;
    }

    if (mode === "edit" && task?.id) {
      data.id = task.id;
    }

    if (mode === "edit") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { project, id: _id, ...newData } = data;
      setSelectedProjectId(project);
      updateTask.mutateAsync(newData);
    } else if (mode === "create") {
      const { project, ...newData } = data;
      setSelectedProjectId(project);
      addTask.mutateAsync(newData);
      reset();
      onClose();
    }
  };

  // Helper function to format date as YYYY-MM-DD
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to parse YYYY-MM-DD string to Date object
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  // Format dates for display in view mode
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to get task type name by ID
  const getTaskTypeName = (id: string): string => {
    const taskType = taskTypes.find((tt) => tt.id === id);
    return taskType ? taskType.name : id;
  };

  // Function to get project type (pipeline) name by ID
  const getProjectTypeName = (id: string): string => {
    const projectType = projectTypes.find((pt) => pt.id === id);
    return projectType ? projectType.name : id;
  };

  // Function to get project name by ID
  const getProjectName = (id: string): string => {
    const project = projects.find((p) => p.id === id);
    return project ? project.name : id;
  };

  // Function to get assignee names
  const getAssigneeNames = (assigneeIds: string[]): string => {
    if (!assigneeIds || assigneeIds.length === 0) return "None";

    const assigneeNames = assigneeIds.map((id) => {
      const user = users.find((u) => u.id === id);
      return user ? user.name || user.email : id;
    });

    return assigneeNames.join(", ");
  };

  // Function to handle file uploads and update parent state
  const handleAttachmentsChange = (files: AttachmentFile[]): void => {
    setAttachmentFiles(files);
    // Update the form state with the file URLs
    setValue(
      "attachments",
      files.map((file) => file.url)
    );
  };

  if (!isOpen) return null;

  // Render different view for "view" mode
  if (isViewMode) {
    const formValues = watch();

    return (
      <Modal title="View task" closeModal={onClose}>
        <div className="p-4 space-y-6">
          {/* Task Name */}
          <div>
            <h3 className="text-sm font-medium text-[#00000099] mb-1">Task name</h3>
            <p className="font-medium">{formValues.name}</p>
          </div>

          {/* Task Type */}
          <div>
            <h3 className="text-sm font-medium text-[#00000099] mb-1">Task type</h3>
            <p>{getTaskTypeName(formValues.task_type_id)}</p>
          </div>

          {/* Pipeline */}
          <div>
            <h3 className="text-sm font-medium text-[#00000099] mb-1">Pipeline</h3>
            <p>{getProjectTypeName(formValues.project_type_id)}</p>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-sm font-medium text-[#00000099] mb-1">Project</h3>
            <p>{getProjectName(formValues.project)}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-[#00000099] mb-1">Description</h3>
            <p className="whitespace-pre-wrap">{formValues.description}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#00000099] mb-1">Start date</h3>
              <p>{formatDateForDisplay(formValues.start_date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#00000099] mb-1">End date</h3>
              <p>{formatDateForDisplay(formValues.end_date)}</p>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <h3 className="text-sm font-medium text-[#00000099] mb-1">Assigned to</h3>
            <div>
              <p>{getAssigneeNames(formValues.assignees)}</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-[#00000099] mb-1">Status</h3>
            <p className="capitalize">{formValues.status.replace("_", " ")}</p>
          </div>

          {/* Attachments */}
          {attachmentFiles.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#00000099] mb-1">Attachments</h3>
              <FileUpload initialAttachments={attachmentFiles} disabled={true} />
            </div>
          )}

          {/* Visibility */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="view_visible_to_client"
              checked={!!formValues.is_visible_to_client}
              disabled={true}
            />
            <label
              htmlFor="view_visible_to_client"
              className="text-sm font-medium text-[#00000099]"
            >
              Visible to client
            </label>
          </div>

          <div className="pt-4">
            <Button type="button" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // Render form for edit/create mode
  return (
    <Modal title={isCreateMode ? "Create task" : "Edit task"} closeModal={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#00000099] mb-1">
            Task name
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input {...field} placeholder="Task name" />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#00000099] mb-1">
            Task type
          </label>
          <Controller
            name="task_type_id"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((taskType) => (
                      <SelectItem key={taskType.id} value={taskType.id}>
                        {taskType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#00000099] mb-1">
            Pipeline
          </label>
          <Controller
            name="project_type_id"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedProjectTypeId(value);
                    // Reset project selection when pipeline changes
                    setValue("project", "");
                  }}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((projectType) => (
                      <SelectItem key={projectType.id} value={projectType.id}>
                        {projectType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#00000099] mb-1">
            Project
          </label>
          <Controller
            name="project"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  disabled={!selectedProjectTypeId}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedProjectTypeId ? "Select project" : "Select pipeline first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProjectTypeId &&
                    projects.filter(
                      (project) => project.project_type_id === selectedProjectTypeId
                    ).length === 0 ? (
                      <div className="px-2 py-1 flex justify-center items-center text-sm text-[#00000099]">
                        No projects found
                      </div>
                    ) : (
                      projects
                        .filter(
                          (project) => project.project_type_id === selectedProjectTypeId
                        )
                        .map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#00000099] mb-1">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Textarea {...field} placeholder="Description" className="min-h-24" />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#00000099] mb-1">
              Start date
            </label>
            <Controller
              name="start_date"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          new Date(field.value).toLocaleDateString()
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseDate(field.value) || undefined}
                        onSelect={(date) => {
                          field.onChange(formatDateForInput(date ?? null));
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#00000099] mb-1">
              End date
            </label>
            <Controller
              name="end_date"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          new Date(field.value).toLocaleDateString()
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseDate(field.value) || undefined}
                        onSelect={(date) => {
                          field.onChange(formatDateForInput(date ?? null));
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#00000099] mb-1">
            Assign to
          </label>
          <Controller
            name="assignees"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={userOptions}
                defaultSelected={field.value || []}
                onChange={field.onChange}
                placeholder="Assign to"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#00000099] mb-1">
            Status
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#00000099] mb-1">
            Attach
          </label>
          <FileUpload
            onAttachmentsChange={handleAttachmentsChange}
            maxFileSize={5 * 1024 * 1024} // 5MB max size
            acceptedFileTypes={["pdf", "docx", "xlsx", "png", "jpg"]}
            initialAttachments={attachmentFiles}
          />
        </div>

        <div className="flex items-center space-x-2 mt-10">
          <Controller
            name="is_visible_to_client"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="is_visible_to_client"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label
            htmlFor="is_visible_to_client"
            className="text-sm font-medium text-[#00000099] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Make visible to client
          </label>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={false}>
            {isCreateMode ? "Create task" : "Update task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
