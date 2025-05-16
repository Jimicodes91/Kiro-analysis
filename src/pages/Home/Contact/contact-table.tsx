import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetCompanyContacts from "@/hooks/contacts/use-get-company-contact";
import { useState } from "react";
import ContactTableRow from "./contact-table-row";

const ContactsTable = ({ search }: { search: string }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  console.log(search);
  const contactsResponse = useGetCompanyContacts(page, pageSize);
  const contacts = Array.isArray(contactsResponse.value?.data?.contacts)
    ? contactsResponse.value.data.contacts
    : [];

  const pagination = contactsResponse.value?.data?.pagination || {
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPage(page + 1);
    }
  };

  const renderTable = () => {
    if (contactsResponse.isPending) {
      return <TableSkeletonRowLoader length={8} noOfRows={pageSize} />;
    }

    if (contactsResponse?.isError) {
      return <EmptyTable message="Something went wrong" length={8} />;
    }

    if (contacts.length === 0) {
      return <EmptyTable message="No contacts found" length={8} />;
    }

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={8}></TableCell>
        </TableRow>
        {contacts?.map((contact) => (
          <ContactTableRow key={contact.id} contact={contact} />
        ))}
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
              <TableHead>Phone number</TableHead>
              <TableHead>No of project</TableHead>
              <TableHead>Active project</TableHead>
              <TableHead>Closed project</TableHead>
              <TableHead>Assigne</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTable()}
        </Table>

        {/* Pagination Controls */}
        {/* {Array.isArray(contactsResponse?.data?.data?.data?.contacts) && contacts.length === 0 */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Showing page {pagination.page} of {pagination.totalPages} • Total{" "}
            {pagination.total} contacts
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs">Rows per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1); // Reset to first page when changing page size
                }}
              >
                <SelectTrigger className="h-8 w-[70px] text-xs">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage || contactsResponse.isPending}
              className="text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage || contactsResponse.isPending}
              className="text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsTable;
