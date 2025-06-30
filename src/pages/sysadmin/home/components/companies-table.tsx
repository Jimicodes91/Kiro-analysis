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
import useGetAllCompanies from "@/hooks/admin/use-get-all-companies";
import PaginationContextProvider from "@/lib/context/pagination-context";
import React from "react";
import CompaniesTableRow from "./companies-table-row";

const CompaniesTable = () => {
  const [pageProp, setPageProp] = React.useState({
    page: 1,
    pageSize: 10,
  });
  const companies = useGetAllCompanies(pageProp.page, pageProp.pageSize);

  const renderTableBody = () => {
    if (companies.isPending)
      return <TableSkeletonRowLoader length={7} noOfRows={pageProp.pageSize} />;

    if (companies?.isError)
      return <EmptyTable message="Something went wrong" length={7} />;

    if (companies?.value?.data?.data?.length === 0)
      return <EmptyTable message="No user found" length={7} />;

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={7}></TableCell>
        </TableRow>
        <>
          {companies?.value?.data?.data?.map((company) => (
            <CompaniesTableRow key={company.id} company={company} />
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
              <TableHead>Company name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Industry Type</TableHead>
              <TableHead>Date created</TableHead>
              <TableHead className="min-w-[100px]">Active user</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
        <PaginationContextProvider
          pageProp={pageProp}
          setPageProp={setPageProp}
          total={companies.value?.data?.pagination?.total ?? 0}
        >
          <TablePagination />
        </PaginationContextProvider>
      </div>
    </div>
  );
};

export default CompaniesTable;
