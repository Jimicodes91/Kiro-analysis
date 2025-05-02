import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllContacts from "@/hooks/contacts/use-get-all-contacts";
import ContactTableRow from "./contact-table-row";

const ContactsTable = () => {
  const contactsResponse = useGetAllContacts();
  const contacts = Array.isArray(contactsResponse.data?.data?.data)
    ? contactsResponse.data.data.data
    : [];

  const renderTable = () => {
    if (contactsResponse.isPending) {
      return <TableSkeletonRowLoader length={8} />;
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
      </div>
    </div>
  );
};

export default ContactsTable;
