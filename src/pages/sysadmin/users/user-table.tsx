import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllUsers from "@/hooks/admin/use-get-all-users";
import PaginationContextProvider from "@/lib/context/pagination-context";
import React from "react";
import UserTableRow from "./user-table-row";

const UsersTable = ({ search }: { search: string }) => {
  const [pageProp, setPageProp] = React.useState({
    page: 1,
    pageSize: 10,
  });
  const users = useGetAllUsers(pageProp.page, pageProp.pageSize, search);

  const renderTableBody = () => {
    if (users.isPending) return <TableSkeletonRowLoader length={7} />;

    if (users?.isError) return <EmptyTable message="Something went wrong" length={7} />;

    if (users?.value?.data?.data?.length === 0)
      return <EmptyTable message="No user found" length={7} />;

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={7}></TableCell>
        </TableRow>
        <>
          {users?.value?.data?.data?.map((user) => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </>
      </TableBody>
    );
  };
  return (
    <div className="grid grid-cols-12 w-full">
      <div className="bg-brand-table col-span-12 rounded-lg p-1 border border-gray-200">
        <Table className="overflow-auto">
          <TableHeader>
            <TableRow className="hover:bg-[#EAECEC] rounded-full border">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Toggle Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
        <PaginationContextProvider
          pageProp={pageProp}
          setPageProp={setPageProp}
          total={users.value?.data?.pagination?.total ?? 0}
        >
          <TablePagination />
        </PaginationContextProvider>
      </div>
    </div>
  );
};

export default UsersTable;
