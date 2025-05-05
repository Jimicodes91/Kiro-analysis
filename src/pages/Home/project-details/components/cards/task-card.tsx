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
import useUpdateProjectTask from "@/hooks/project-modules/tasks/use-update-project-task";
import useDisclosure from "@/hooks/use-disclosure";
import getInitials, { getFormattedText } from "@/lib/utils";
import { TaskDetails } from "@/types/api.types";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import DeleteTaskModal from "../modal/delete-task-modal";
import EditProjectTaskModal from "../modal/edit-project-task-modal";

function TaskCard({ task }: { task: TaskDetails }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const updateTask = useUpdateProjectTask(task.project_id, task?.id);

  const markTaskAsCompleted = () => {
    updateTask
      .mutateAsync({
        status: "completed",
      })
      .catch(console.error);
  };

  return (
    <>
      <div className="px-5 py-3 space-y-2 rounded-lg border border-brand-border bg-[#F8F8F8]">
        <div className="flex items-center justify-between">
          <Badge variant={task?.status}>{getFormattedText(task?.status)}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" isLoading={updateTask.isPending}>
                <Icons.more />
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
              <span className="text-primary">{format(task?.end_date, "PPP")}</span>
            </p>
          </div>
          <div className="flex -space-x-2">
            {task?.assignees?.map((member, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center mt-2 w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm font-medium ring-2 ring-white"
              >
                {getInitials(member?.name ?? member?.email)}
              </div>
            ))}
          </div>
        </div>
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
    </>
  );
}

export default TaskCard;
