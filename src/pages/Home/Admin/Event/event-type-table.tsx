import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllProjectEventTypes from "@/hooks/project-modules/event-types/use-get-all-event-types";
import EventTypeTableRow from "./event-type-table-row";

const EventTypeTable = () => {
  const eventTypes = useGetAllProjectEventTypes();

  const renderTableBody = () => {
    if (eventTypes.isPending) return <TableSkeletonRowLoader length={3} />;

    if (eventTypes?.isError)
      return <EmptyTable message="Something went wrong" length={3} />;

    if (eventTypes?.value?.data?.length === 0)
      return <EmptyTable message="No Event type found" length={3} />;

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={7}></TableCell>
        </TableRow>
        <>
          {eventTypes?.value?.data?.map((eventType) => (
            <EventTypeTableRow key={eventType.id} eventType={eventType} />
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
              <TableHead>Description</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>
    </div>
  );
};

export default EventTypeTable;
