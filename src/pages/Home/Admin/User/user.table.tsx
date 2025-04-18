import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllUsers from "@/hooks/admin/use-get-all-users";
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import { getUserSession } from "@/services/api.service";
import UserTableRow from "./user-table-row";

const UsersTable = () => {
  const session = getUserSession();
  const users = useGetAllUsers();
  useGetCompanyUsers(session?.company_id ?? "");
  const renderTableBody = () => {
    if (users.isPending) return <TableSkeletonRowLoader length={7} />;

    if (users?.value?.data?.length === 0)
      return <EmptyTable message="No project found" length={7} />;

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={9}></TableCell>
        </TableRow>
        <>
          {users?.value?.data?.map((user) => <UserTableRow key={user.id} user={user} />)}
        </>
      </TableBody>
    );
  };
  return (
    <div className="grid grid-cols-12 w-full">
      <div className="bg-brand-table col-span-12 rounded-lg p-1 border border-gray-200">
        <Table className="overflow-auto">
          <TableHeader>
            <TableRow className="hover:bg-[#EAECEC] rounded-full border border-[#D3D4D4]">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Toggle Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>
    </div>
  );
};

export default UsersTable;
