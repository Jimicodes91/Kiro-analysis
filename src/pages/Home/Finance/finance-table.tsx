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
import useGetAllFinanceRecords from "@/hooks/finance/use-get-all-finance-records";
import { getUserSession } from "@/services/api.service";
import { useState } from "react";
import FinanceTableRow from "./finance-table-row";

const FinanceTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const session = getUserSession();
  const billingsResponse = useGetAllFinanceRecords(
    session?.company_id ?? "",
    page,
    pageSize
  );
  const billings = Array.isArray(billingsResponse.data?.data?.data?.org_finance)
    ? billingsResponse.data.data.data?.org_finance
    : [];

  const pagination = billingsResponse.data?.data?.data?.pagination || {
    total: 0,
    page: 1,
    pageSize: 10,
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
    if (billingsResponse.isPending) {
      return <TableSkeletonRowLoader length={7} />;
    }

    if (billingsResponse?.isError) {
      return <EmptyTable message="Something went wrong" length={7} />;
    }

    if (billings.length === 0) {
      return <EmptyTable message="No billing entries found" length={7} />;
    }

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={7}></TableCell>
        </TableRow>
        {billings?.map((billing) => (
          <FinanceTableRow key={billing.id} billing={billing} />
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
              <TableHead>Client name</TableHead>
              <TableHead>Project title</TableHead>
              <TableHead>Total amount</TableHead>
              <TableHead>Amount paid</TableHead>
              <TableHead>Outstanding balance</TableHead>
              <TableHead>Next payment due</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTable()}
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Showing page {pagination.page} of {pagination.totalPages} • Total{" "}
            {pagination.total} billings
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs">Rows per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
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
              disabled={!pagination.hasPreviousPage || billingsResponse.isPending}
              className="text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage || billingsResponse.isPending}
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

export default FinanceTable;
