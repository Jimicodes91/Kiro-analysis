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
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import useToggleCompanyUserStatus from "@/hooks/company-admin/use-toggle-comppany-user-status";
import useDisclosure from "@/hooks/use-disclosure";
import { UserDetails } from "@/types/api.types";

function UserTableRow({ user }: { user: UserDetails }) {
  const { onOpen } = useDisclosure();
  const {
    //   isOpen: isDeleteUserOpen,
    //   onClose: onDeleteUserClose,
    onOpen: onDeleteUserOpen,
  } = useDisclosure();
  const toggleUserStatus = useToggleCompanyUserStatus(user?.id ?? "");
  return (
    <>
      <TableRow>
        <TableCell>{user?.name ?? "----- -----"}</TableCell>
        <TableCell>{user?.email}</TableCell>
        <TableCell>{user?.company_id}</TableCell>

        <TableCell>{user?.role}</TableCell>

        <TableCell>
          <Badge variant={user?.is_active ? "success" : "destructive"}>
            <span>{user?.is_active ? "Active" : "Inactive"}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <Switch
              disabled={toggleUserStatus.isPending}
              id="airplane-mode"
              checked={Boolean(user?.is_active)}
              onCheckedChange={() => toggleUserStatus.mutateAsync({})}
            />
            {toggleUserStatus.isPending && (
              <Icons.spinner className="animate-spin h-4 w-4" />
            )}
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
                <>
                  <DropdownMenuItem onClick={onOpen}>Edit User</DropdownMenuItem>
                  <DropdownMenuItem onClick={onDeleteUserOpen}>
                    Delete User
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
export default UserTableRow;
