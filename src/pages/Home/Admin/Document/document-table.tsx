import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import { getUserSession } from "@/services/api.service";
import DocumentTableRow from "./document-table-row";

const DocumentTable = () => {
  const session = getUserSession();
  const users = useGetCompanyUsers(session?.company_id ?? "");
  const renderTableBody = () => {
    if (users.isPending) return <TableSkeletonRowLoader length={7} />;

    if (users?.isError) return <EmptyTable message="Something went wrong" length={7} />;

    if (users?.value?.data?.length === 0)
      return <EmptyTable message="No document found" length={7} />;

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={7}></TableCell>
        </TableRow>
        <>
          {users?.value?.data?.map((user) => (
            <DocumentTableRow key={user.id} user={user} />
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
              <TableHead>Type name</TableHead>
              <TableHead>Access level</TableHead>
              <TableHead>Expiration policy</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>
    </div>
  );
};

export default DocumentTable;
