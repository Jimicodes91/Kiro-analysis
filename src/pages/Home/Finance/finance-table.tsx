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
import useGetAllFinanceRecords from "@/hooks/finance/use-get-all-finance-records";
import PaginationContextProvider from "@/lib/context/pagination-context";
import { getUserSession } from "@/services/api.service";
import { useState } from "react";
import FinanceTableRow from "./finance-table-row";

const FinanceTable = () => {
  const [pageProp, setPageProp] = useState({
    page: 1,
    pageSize: 10,
  });
  const session = getUserSession();
  const billingsResponse = useGetAllFinanceRecords(
    session?.company_id ?? "",
    pageProp.page,
    pageProp.pageSize
  );
  const billings = Array.isArray(billingsResponse.data?.data?.data?.org_finance)
    ? billingsResponse.data.data.data?.org_finance
    : [];

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

        <PaginationContextProvider
          pageProp={pageProp}
          setPageProp={setPageProp}
          total={billingsResponse.value?.data?.pagination?.total ?? 0}
        >
          <TablePagination />
        </PaginationContextProvider>
      </div>
    </div>
  );
};

export default FinanceTable;
