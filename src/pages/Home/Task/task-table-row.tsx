import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { TableCell, TableRow } from "@/components/ui/table";
import useDisclosure from "@/hooks/use-disclosure";
import { Task } from "@/types/task.types";
import { useState } from "react";
import TaskModal from "./task-modal-form";

function TaskTableRow({ task }: { task: Task }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<"create" | "view" | "edit">("view");
  const { onOpen: onDeleteOpen } = useDisclosure();

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
        <TableCell>{task.taskName}</TableCell>
        <TableCell>{task.clientName}</TableCell>
        <TableCell>{task.company}</TableCell>
        <TableCell>{task.endDate}</TableCell>
        <TableCell>
          <Badge
            variant={
              task.status === "completed"
                ? "success"
                : task.status === "in_progress"
                  ? "customer"
                  : "warn"
            }
          >
            {/* {task.status === "completed" && <Icons.check className="mt-1.5" />} */}
            <span>{task.status}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex -space-x-2">
            {task.assignee.map((initial, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-white">
                <AvatarFallback className="text-xs bg-gray-200">{initial}</AvatarFallback>
              </Avatar>
            ))}
          </div>
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
                <DropdownMenuItem onClick={handleViewClick}>View Task</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick}>Edit Task</DropdownMenuItem>
                <DropdownMenuItem onClick={onDeleteOpen}>Delete Task</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={task}
          mode={currentMode}
        />
      )}
    </>
  );
}

export default TaskTableRow;
