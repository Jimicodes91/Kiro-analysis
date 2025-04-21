import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "../ui/table-row-skeleton";
import ProjectTableRow from "./project-table-row";

interface TableViewProps {
  projectData: ReturnType<typeof useGetAllProjects>;
}

const TableView: React.FC<TableViewProps> = ({ projectData }) => {
  const renderTableBody = () => {
    if (projectData.isPending) return <TableSkeletonRowLoader length={9} />;

    if (projectData?.value?.data?.length === 0)
      return <EmptyTable message="No project found" length={9} />;

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={9}></TableCell>
        </TableRow>
        <>
          {projectData?.value?.data?.map((project) => (
            <ProjectTableRow key={project.id} project={project} />
          ))}
        </>
      </TableBody>
    );
  };
  return (
    <div className="grid grid-cols-12 w-full">
      <div className="bg-brand-table col-span-12 rounded-lg p-1 border border-gray-200">
        <Table className="overflow-auto mb-20">
          <TableHeader>
            <TableRow className="hover:bg-[#EAECEC] rounded-full border border-[#D3D4D4]">
              <TableHead>Title</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead>Expected end date</TableHead>
              <TableHead>Completed date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Project team</TableHead>
              <TableHead>Client team</TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>
    </div>
  );
};

export default TableView;
