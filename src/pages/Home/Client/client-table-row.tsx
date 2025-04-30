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
import { Client } from "@/types/client.types";
import { useState } from "react";
import AddUserToClientModal from "./add-user-to-client-modal-form";

function ClientTableRow({ client }: { client: Client }) {
  const { onOpen: onEditOpen } = useDisclosure();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const { onOpen: onDeleteOpen } = useDisclosure();

  return (
    <>
      <TableRow>
        <TableCell>{client.serialNumber}</TableCell>
        <TableCell>{client.clientName}</TableCell>
        <TableCell>{client.projects}</TableCell>
        <TableCell>{client.plan}</TableCell>
        <TableCell>{client.users}</TableCell>
        <TableCell>
          <Badge variant={client.status === "Completed" ? "success" : "warn"}>
            {/* {client.status === "Completed" && <Icons.check className="mt-1.5" />} */}
            <span>{client.status}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex -space-x-2">
            {client.assignee.map((initial, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-white">
                <AvatarFallback className="text-xs bg-gray-200">{initial}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </TableCell>
        <TableCell>{client.registrationDate}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.more />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onEditOpen}>Edit Client</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddUserModalOpen(true)}>
                  Add User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDeleteOpen}>Delete Client</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Add User Modal - Only shows when triggered from menu */}
      {isAddUserModalOpen && (
        <AddUserToClientModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          clientName={client.clientName}
        />
      )}
    </>
  );
}

export default ClientTableRow;
