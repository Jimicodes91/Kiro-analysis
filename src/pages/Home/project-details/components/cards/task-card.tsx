import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import PersonAvatar from "@/components/ui/person-avatar";
import useUpdateProjectTask from "@/hooks/project-modules/tasks/use-update-project-task";
import useDisclosure from "@/hooks/use-disclosure";
import { getFormattedText } from "@/lib/utils";
import { TaskDetails } from "@/types/api.types";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import DeleteTaskModal from "../modal/delete-task-modal";
import EditProjectTaskModal from "../modal/edit-project-task-modal";
import UploadDocumentModal from "../modal/upload-document-modal";

function TaskCard({ task }: { task: TaskDetails }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [showComments, setShowComments] = useState(false);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();
  const updateTask = useUpdateProjectTask(task.project_id, task?.id);

  const markTaskAsCompleted = () => {
    updateTask
      .mutateAsync({
        status: "completed",
      })
      .catch(console.error);
  };

  const isRequest = task?.task_type?.name === "Document Request";
  return (
    <>
      <div className="px-5 py-3 space-y-2 rounded-lg border border-brand-border bg-[#F8F8F8]">
        <div className="flex items-center justify-between">
          <Badge variant={task?.status}>{getFormattedText(task?.status)}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" isLoading={updateTask.isPending}>
                <Icons.more className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onEditOpen}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={markTaskAsCompleted}
                  disabled={task.status === "completed"}
                >
                  Mark as completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onOpen}>Delete</DropdownMenuItem>
                {isRequest && task.status !== "completed" && (
                  <DropdownMenuItem onClick={onUploadOpen}>
                    Upload requested document
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Heading size="h5">{task?.name}</Heading>
          <p className="text-sm text-brand-fade">{task?.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-brand-fade p-0 m-0 pt-1">
              Due date:{" "}
              <span className="text-primary">{task?.due_date ? format(task.due_date, "PPP") : task?.end_date ? format(task.end_date, "PPP") : "Not set"}</span>
            </p>
          </div>
          <div className="flex -space-x-2">
            {task?.assignees?.map((member) => (
              <PersonAvatar
                key={member.name}
                name={member?.name ?? ""}
                email={member?.email}
              />
            ))}
          </div>
        </div>
        {/* Comments toggle */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
        >
          {showComments ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          Comments
        </button>
        {showComments && (
          <div className="mt-2 border-t pt-3">
            <TaskComments projectId={task.project_id} taskId={task.id} />
          </div>
        )}
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <DeleteTaskModal
            projectId={task.project_id}
            taskId={task?.id}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isEditOpen && (
          <EditProjectTaskModal
            isOpen={isEditOpen}
            task={task}
            projectId={task.project_id}
            onClose={onEditClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isUploadOpen && (
          <UploadDocumentModal
            isOpen={isUploadOpen}
            projectId={task.project_id}
            onClose={onUploadClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default TaskCard;
