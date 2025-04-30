// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Contact } from "@/types/contact.types";
// import { useState } from "react";
// import ContactModal from "./contact-modal-form";

function ContactTableRow({ contact }: { contact: Contact }) {
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const [currentMode, setCurrentMode] = useState<"create" | "view" | "edit">("view");
  const { onOpen: onDeleteOpen } = useDisclosure();

  const handleEditClick = () => {
    // setCurrentMode("edit");
    // setIsModalOpen(true);
  };

  const handleViewClick = () => {
    // setCurrentMode("view");
    // setIsModalOpen(true);
  };

  return (
    <>
      <TableRow>
        <TableCell>{contact.name}</TableCell>
        <TableCell>{contact.email}</TableCell>
        <TableCell>{contact.phone}</TableCell>
        <TableCell>{contact.no_of_projects}</TableCell>
        <TableCell>{contact.active_projects}</TableCell>
        <TableCell> {contact.closed_projects}</TableCell>
        <TableCell>
          {" "}
          {contact.assigne}
          {/* <div className="flex -space-x-2">
            {contact.assignee.map((initial, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-white">
                <AvatarFallback className="text-xs bg-gray-200">{initial}</AvatarFallback>
              </Avatar>
            ))}
          </div> */}
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
                <DropdownMenuItem onClick={handleViewClick}>
                  View Contact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick}>
                  Edit Contact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDeleteOpen}>Delete Contact</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* {isModalOpen && (
        <ContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contact={contact}
          mode={currentMode}
        />
      )} */}
    </>
  );
}

export default ContactTableRow;
