import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import useToggleCompanyUserStatus from "@/hooks/company-admin/use-toggle-comppany-user-status";
import { UserDetails } from "@/types/api.types";

function UserTableRow({ user, isEditable }: { user: UserDetails; isEditable?: boolean }) {
  const toggleUserStatus = useToggleCompanyUserStatus(user?.id ?? "");
  return (
    <>
      <TableRow>
        <TableCell>{user?.name}</TableCell>
        <TableCell>{user?.email}</TableCell>

        <TableCell>{user?.role}</TableCell>

        <TableCell>
          <Badge variant={user?.is_active ? "success" : "destructive"}>
            <span>{user?.is_active ? "Active" : "Inactive"}</span>
          </Badge>
        </TableCell>
        {isEditable && (
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
        )}
      </TableRow>
    </>
  );
}
export default UserTableRow;
