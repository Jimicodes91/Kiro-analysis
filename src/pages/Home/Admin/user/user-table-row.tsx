import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import useSendConsultantInvite from "@/hooks/auth/use-send-consultant-invite";
import useToggleCompanyUserStatus from "@/hooks/company-admin/use-toggle-comppany-user-status";
import { QUERYKEYS } from "@/lib/constants";
import { UserDetails } from "@/types/api.types";
import { useQueryClient } from "@tanstack/react-query";

function UserTableRow({ user, isEditable }: { user: UserDetails; isEditable?: boolean }) {
  const toggleUserStatus = useToggleCompanyUserStatus(user?.id ?? "");
  const sendConsultantInvite = useSendConsultantInvite();
  const queryClient = useQueryClient();

  const onResendInvite = async () => {
    sendConsultantInvite
      .mutateAsync({
        email: user?.email ?? "",
        role: user?.role ?? "",
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: [QUERYKEYS.GET_ALL_COMPANY_USERS],
        });
      })
      .catch(console.error);
  };

  return (
    <>
      <TableRow>
        <TableCell>{user?.name ?? "----- -----"}</TableCell>
        <TableCell>{user?.email}</TableCell>

        <TableCell>{user?.role}</TableCell>

        <TableCell>
          <Badge variant={user?.is_active ? "success" : "destructive"}>
            <span>{user?.is_active ? "Active" : "Inactive"}</span>
          </Badge>
        </TableCell>
        {isEditable && (
          <TableCell>
            {user?.status === "INACTIVE" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onResendInvite}
                isLoading={sendConsultantInvite.isPending}
              >
                Resend
              </Button>
            ) : (
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
            )}
          </TableCell>
        )}
      </TableRow>
    </>
  );
}
export default UserTableRow;
