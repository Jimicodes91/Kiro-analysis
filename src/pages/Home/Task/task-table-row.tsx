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
// import useDisclosure from "@/hooks/use-disclosure";
import getInitials, { getFormattedText } from "@/lib/utils";
import { Task } from "@/types/task.types";
import { useState } from "react";
import TaskModal from "./task-modal-form";

function TaskTableRow({ task }: { task: Task }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<"create" | "view" | "edit">("view");
  // const { onOpen: onDeleteOpen } = useDisclosure();

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
        {/* <TableCell> -{task.clientName}</TableCell> */}
        <TableCell>{task.company.name}</TableCell>
        <TableCell>{task.end_date}</TableCell>
        <TableCell>
          <Badge variant={task.status}>
            <span>{getFormattedText(task.status)}</span>
          </Badge>
        </TableCell>
        <TableCell>
          {Array.isArray(task?.assignees) && task.assignees.length > 0 ? (
            <div className="flex -space-x-2">
              {task.assignees.map((assignee, index) => (
                <Avatar
                  key={assignee.id || index}
                  className="h-7 w-7 border-2 border-white"
                >
                  <AvatarFallback className="text-xs bg-gray-200">
                    {getInitials(assignee.name || "")}
                  </AvatarFallback>
                </Avatar>
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
                <DropdownMenuItem onClick={handleViewClick}>View Task</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick}>Edit Task</DropdownMenuItem>
                {/* <DropdownMenuItem onClick={onDeleteOpen}>Delete Task</DropdownMenuItem> */}
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

      {/* {isViewModalOpen && (
        <TaskModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          task={task}
        />
      )}
      {isEditModalOpen && (
        <TaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={task}
        />
      )} */}
    </>
  );
}

export default TaskTableRow;
