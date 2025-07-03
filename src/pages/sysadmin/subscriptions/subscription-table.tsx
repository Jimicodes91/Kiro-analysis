import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllPlans from "@/hooks/subscription/use-get-all-plans";
import SubscriptionTableRow from "./subscription-table-row";

const SubscriptionTable = () => {
  const allPlans = useGetAllPlans();

  const renderTableBody = () => {
    if (allPlans.isPending) return <TableSkeletonRowLoader length={7} />;

    if (allPlans?.isError)
      return <EmptyTable message="Something went wrong" length={7} />;

    if (allPlans?.value?.data?.length === 0)
      return <EmptyTable message="No user found" length={7} />;

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={7}></TableCell>
        </TableRow>
        <>
          {allPlans?.value?.data?.map((plan) => (
            <SubscriptionTableRow key={plan.id} plan={plan} />
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
              <TableHead>Plan name</TableHead>
              <TableHead>Price per seat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Action</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>
    </div>
  );
};

export default SubscriptionTable;
