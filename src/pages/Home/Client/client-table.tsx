import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import TableSkeletonRowLoader from "@/components/ui/table-row-skeleton";
import ClientTableRow from "./client-table-row";
import { useClientData } from "./use-client-data";

const ClientsTable = () => {
  const {
    clients,
    //  loading
  } = useClientData();

  const renderTableBody = () => {
    // if (loading) return <TableSkeletonRowLoader length={9} />;

    return (
      <>
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={9}></TableCell>
        </TableRow>
        {clients.map((client) => (
          <ClientTableRow key={client.id} client={client} />
        ))}
      </>
    );
  };

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="bg-brand-table col-span-12 rounded-lg p-1 border border-gray-200">
        <Table className="overflow-auto">
          <TableHeader>
            <TableRow className="hover:bg-[#EAECEC] rounded-full border border-[#D3D4D4]">
              <TableHead>Serial Number</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Registration date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">{renderTableBody()}</TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsTable;
