import Modal from "@/components/Modal";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useUpdateTaskStatus from "@/hooks/project-modules/tasks/use-update-task-status";
import { taskStatuses } from "@/lib/constants";
import { getFormattedText } from "@/lib/utils";
import { Task } from "@/types/task.types";
import TaskComments from "./task-comments";

interface TaskDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const CATEGORY_LABELS: Record<string, string> = {
  review: "Review",
  approval: "Approval",
  meeting: "Meeting",
  follow_up: "Follow-up",
};

const TaskDetailPanel = ({ isOpen, onClose, task }: TaskDetailPanelProps) => {
  const categoryLabel =
    CATEGORY_LABELS[task.task_category_type ?? ""] ?? task.task_category_type ?? "—";
  const updateStatus = useUpdateTaskStatus(task.project_id ?? null, task.id);

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutateAsync({ status: newStatus }).catch(console.error);
  };

  return (
    <Modal title={task.name} closeModal={onClose} isOpen={isOpen}>
      <div className="p-4 space-y-6">
        {/* Status */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Status</span>
          <Select value={task.status} onValueChange={handleStatusChange} disabled={updateStatus.isPending}>
            <SelectTrigger className="w-[160px] h-8 rounded-full border-brand-border text-sm">
              <SelectValue>{getFormattedText(task.status)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {taskStatuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Category</span>
          <Badge variant="outline" className="text-xs">
            {categoryLabel}
          </Badge>
        </div>

        {/* Comments section */}
        <TaskComments
          projectId={task.project_id ?? ""}
          taskId={task.id}
        />
      </div>
    </Modal>
  );
};

export default TaskDetailPanel;
