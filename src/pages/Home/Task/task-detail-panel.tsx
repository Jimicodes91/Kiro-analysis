import Modal from "@/components/Modal";
import { Badge } from "@/components/ui/badge";
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

  return (
    <Modal title={task.name} closeModal={onClose} isOpen={isOpen}>
      <div className="p-4 space-y-6">
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
