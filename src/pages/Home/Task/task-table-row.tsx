import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import PersonAvatar from "@/components/ui/person-avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import useDisclosure from "@/hooks/use-disclosure";
import { getFormattedText } from "@/lib/utils";
import { Task } from "@/types/task.types";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import DeleteTaskModal from "./delete-task-modal";
import ViewEditTaskModal from "./edit-task-modal";

function TaskTableRow({ task }: { task: Task }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<"view" | "edit">("view");
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleEditClick = () => {
    setCurrentMode("edit");
    setIsModalOpen(true);
  };

  const handleViewClick = () => {
    setCurrentMode("view");
    setIsModalOpen(true);
  };

  return (
    <>
      <TableRow>
        <TableCell>{task.name}</TableCell>
        <TableCell>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              task.task_category === TaskCategory.EXTERNAL
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {task.task_category === TaskCategory.EXTERNAL ? "External" : "Internal"}
          </span>
        </TableCell>
        <TableCell>{task.project.name}</TableCell>
        <TableCell>{task.project?.client_organization}</TableCell>
        <TableCell>{task.end_date}</TableCell>
        <TableCell>
          <Badge variant={task.status}>
            <span>{getFormattedText(task.status)}</span>
          </Badge>
        </TableCell>
        <TableCell>
          {task.task_category === TaskCategory.EXTERNAL && Array.isArray(task?.client_assignees) && task.client_assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {task.client_assignees.map((ca) => (
                <PersonAvatar
                  key={ca.id}
                  name={ca.client?.name ?? ""}
                  email={ca.client?.email}
                />
              ))}
            </div>
          ) : Array.isArray(task?.assignees) && task.assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assignees.map((assignee) => (
                <PersonAvatar
                  key={assignee.name}
                  name={assignee?.name ?? ""}
                  email={assignee?.email}
                />
              ))}
            </div>
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.more className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleViewClick}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={onOpen}>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <DeleteTaskModal
            projectId={task?.project_id}
            taskId={task?.id}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isModalOpen && (
          <ViewEditTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            taskData={task}
            mode={currentMode}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default TaskTableRow;
