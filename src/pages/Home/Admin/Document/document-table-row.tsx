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
import { UserDetails } from "@/types/api.types";

function DocumentTableRow({ user }: { user: UserDetails }) {
  const { onOpen } = useDisclosure();
  const {
    //   isOpen: isDeleteUserOpen,
    //   onClose: onDeleteUserClose,
    onOpen: onDeleteUserOpen,
  } = useDisclosure();
  return (
    <>
      <TableRow>
        <TableCell>{user?.name}</TableCell>
        <TableCell>{user?.email}</TableCell>
        <TableCell>{user?.role}</TableCell>

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
                  <DropdownMenuItem onClick={onOpen}>Edit Document</DropdownMenuItem>
                  <DropdownMenuItem onClick={onDeleteUserOpen}>
                    Delete Document
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
