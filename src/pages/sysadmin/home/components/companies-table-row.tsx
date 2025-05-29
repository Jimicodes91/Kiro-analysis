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
import { CompanyDetails } from "@/types/api.types";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function CompaniesTableRow({ company }: { company: CompanyDetails }) {
  const { onOpen } = useDisclosure();

  // const toggleUserStatus = useToggleCompanyUserStatus(company?.id ?? "");
  return (
    <>
      <TableRow>
        <TableCell className="capitalize">{company?.name}</TableCell>
        <TableCell>{company?.address}</TableCell>

        <TableCell className="capitalize">{company?.industry_type}</TableCell>

        <TableCell>
          {/* <div className="flex items-center">
            <Switch
              disabled={toggleUserStatus.isPending}
              id="airplane-mode"
              checked={Boolean(company?.is_active)}
              onCheckedChange={() => toggleUserStatus.mutateAsync({})}
            />
            {toggleUserStatus.isPending && (
              <Icons.spinner className="animate-spin h-4 w-4" />
            )}
          </div> */}
          {format(company?.created_at, "PPP")}
        </TableCell>

        <TableCell className="capitalize">{company?.active_users_count}</TableCell>
        <TableCell>
          <Badge variant={company?.is_active ? "success" : "destructive"}>
            <span>{company?.is_active ? "Active" : "Inactive"}</span>
          </Badge>
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
                  <DropdownMenuItem asChild onClick={onOpen}>
                    <Link to={`/sysadmin/companies/${company?.id}`}>View Company</Link>
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
export default CompaniesTableRow;
