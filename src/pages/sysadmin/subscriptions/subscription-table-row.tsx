import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import useToggleCompanyUserStatus from "@/hooks/company-admin/use-toggle-comppany-user-status";
import { SubscriptionPlan } from "@/types/api.types";

function SubscriptionTableRow({ plan }: { plan: SubscriptionPlan }) {
  const toggleUserStatus = useToggleCompanyUserStatus(plan?.id ?? "");
  return (
    <>
      <TableRow>
        <TableCell>{plan?.display_name}</TableCell>
        <TableCell>
          {plan?.currency} {plan?.price}
        </TableCell>

        <TableCell>
          <Badge variant={plan?.is_active ? "success" : "destructive"}>
            <span>{plan?.is_active ? "Active" : "Inactive"}</span>
          </Badge>
        </TableCell>
        <TableCell>31 days</TableCell>

        <TableCell>
          <div className="flex items-center">
            <Switch
              disabled={toggleUserStatus.isPending}
              id="airplane-mode"
              checked={Boolean(plan?.is_active)}
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
                {/* <DropdownMenuItem onClick={onOpen}>Edit User</DropdownMenuItem> */}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
export default SubscriptionTableRow;
