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
        <TableCell>{task.project.name}</TableCell>
        <TableCell>{task.project?.client_organization}</TableCell>
        <TableCell>{task.end_date}</TableCell>
        <TableCell>
          <Badge variant={task.status}>
            <span>{getFormattedText(task.status)}</span>
          </Badge>
        </TableCell>
        <TableCell>
          {Array.isArray(task?.assignees) && task.assignees.length > 0 ? (
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
                <Icons.more />
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
