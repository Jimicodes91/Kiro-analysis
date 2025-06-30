import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EventTableRow from "./event-table-row";
import { useEventData } from "./use-event-data";
// import TableSkeletonRowLoader from "@/components/ui/table-row-skeleton";

const EventsTable = () => {
  const {
    events,
    //  loading
  } = useEventData();

  const renderTableBody = () => {
    // if (loading) return <TableSkeletonRowLoader length={9} />;

    return (
      <>
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={9}></TableCell>
        </TableRow>
        {events.map((event) => (
          <EventTableRow key={event.id} event={event} />
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
              <TableHead>Event Title</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">{renderTableBody()}</TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EventsTable;
