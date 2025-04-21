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
import { DocumentTypeDetails } from "@/types/api.types";

function DocumentTableRow({ documentType }: { documentType: DocumentTypeDetails }) {
  const { onOpen } = useDisclosure();
  const { onOpen: onDeleteUserOpen } = useDisclosure();
  return (
    <>
      <TableRow>
        <TableCell>{documentType?.name}</TableCell>
        <TableCell>{documentType?.description}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.more />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <>
                  <DropdownMenuItem onClick={onOpen}>Edit Document Type</DropdownMenuItem>
                  <DropdownMenuItem onClick={onDeleteUserOpen}>
                    Delete Document Type
                  </DropdownMenuItem>
                </>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {/* <UpdateUserRoleModal
        key={user?.role}
        isOpen={isOpen}
        onClose={onClose}
        user={user}
      />
      <DeleteUserModal
        isOpen={isDeleteUserOpen}
        onClose={onDeleteUserClose}
        user={user}
      /> */}
    </>
  );
}
export default DocumentTableRow;
