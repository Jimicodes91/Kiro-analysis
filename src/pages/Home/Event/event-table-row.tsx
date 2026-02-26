import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Event } from "@/types/event.types";
import { useState } from "react";
import EventModal from "./event-modal-form";

function EventTableRow({ event }: { event: Event }) {
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
        <TableCell>{event.eventTitle}</TableCell>
        <TableCell>{event.projectName}</TableCell>
        <TableCell>{event.date}</TableCell>
        <TableCell>
          <div className="flex -space-x-2">
            {event.assignee.map((initial, index) => (
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
                <Icons.more className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleViewClick}>View Event</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick}>Edit Event</DropdownMenuItem>
                <DropdownMenuItem onClick={onDeleteOpen}>Delete Event</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={event}
          mode={currentMode}
        />
      )}
    </>
  );
}

export default EventTableRow;
