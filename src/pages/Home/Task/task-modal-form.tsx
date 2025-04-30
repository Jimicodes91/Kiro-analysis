import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import FileUpload, { AttachmentFile } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Task, TaskFormData } from "@/types/task.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view" | "edit";
  task?: Task;
}

const taskSchema = yup.object({
  taskName: yup.string().required("Task name is required"),
  taskType: yup.string().required("Task type is required"),
  projectType: yup.string().required("Project type is required"),
  startDate: yup.string().required("Start Date is required"),
  endDate: yup.string().required("End Date is required"),
  status: yup.string().required("Status is required"),
  description: yup.string().required("Description is required"),
  visibleToClient: yup.boolean().default(false),
});

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, mode, task }) => {
  const [loading, setLoading] = useState(false);
  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";

  const { control, handleSubmit, reset, setValue } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      taskName: "",
      taskType: "",
      projectType: "",
      startDate: "",
      endDate: "",
      status: "",
      description: "",
      visibleToClient: false,
      attachments: [],
    },
  });

  useEffect(() => {
    if (task && (mode === "edit" || mode === "view")) {
      // Populate form with task data
      setValue("taskName", task.taskName);
      setValue("taskType", task.taskType || "");
      setValue("projectType", task.projectType || "");
      setValue("startDate", task.startDate);
      setValue("endDate", task.endDate);
      setValue("assignTo", task.assignTo);
      setValue("status", task.status || "");
      setValue("description", task.description || "");
      setValue("visibleToClient", task.visibleToClient || false);
      setValue("attachments", task.attachments || []);
    }
  }, [task, mode, setValue]);

  const handleFormSubmit = async (data: TaskFormData) => {
    if (isViewMode) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      if (mode === "edit" && task?.id) {
        data.id = task.id;
      }

      if (mode === "edit") {
        // await updateTask(data);
        console.log("Updating task:", data);
      } else if (mode === "create") {
        // await createTask(data);
        console.log("Creating task:", data);
      }

      onClose();
      reset();
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  // Function to handle file uploads and update parent state
  const handleAttachmentsChange = (files: AttachmentFile[]): void => {
    // Update the form state with the file URLs
    setValue(
      "attachments",
      files.map((file) => file.url)
    );
  };

  return (
    <Modal
      title={isCreateMode ? "Create task" : isViewMode ? "View task" : "Edit task"}
      closeModal={onClose}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#00000099] mb-1">
            Task name
          </label>
          <Controller
            name="taskName"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  disabled={isViewMode}
                  placeholder="Task name"
                  className={isViewMode ? "bg-gray-100" : ""}
                />
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
            name="taskType"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={`${isViewMode ? "bg-gray-100" : ""} w-full`}>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
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
            name="projectType"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={`${isViewMode ? "bg-gray-100" : ""} w-full`}>
                    <SelectValue placeholder="Select pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
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
                <Textarea
                  {...field}
                  disabled={isViewMode}
                  placeholder="Description"
                  className={`min-h-24 ${isViewMode ? "bg-gray-100" : ""}`}
                />
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
              name="startDate"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          isViewMode && "bg-gray-100 pointer-events-none"
                        )}
                        disabled={isViewMode}
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
              name="endDate"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          isViewMode && "bg-gray-100 pointer-events-none"
                        )}
                        disabled={isViewMode}
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
            Status
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={`${isViewMode ? "bg-gray-100" : ""} w-full`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
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
          />
        </div>

        <div className="flex items-center space-x-2 mt-10">
          <Controller
            name="visibleToClient"
            control={control}
            render={({ field }) => (
              <Switch
                id="visibleToClient"
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={isViewMode}
              />
            )}
          />
          <label
            htmlFor="visibleToClient"
            className="text-sm font-medium text-[#00000099] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Make visible to client
          </label>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={loading || isViewMode}>
            {isCreateMode ? "Create task" : isViewMode ? "Close" : "Update task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
