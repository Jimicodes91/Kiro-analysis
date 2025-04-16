import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { TableBody } from "../ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "../ui/table-row-skeleton";
import TableRow from "./TableRow";

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
        <>
          {projectData?.value?.data?.map((project) => (
            <TableRow key={project.id} row={project} />
          ))}
        </>
      </TableBody>
    );
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr className="bg-[#EAECEC] py-1 rounded-md">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Organization
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expected end date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completed date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project team
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client team
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <IoSettingsOutline />
            </th>
          </tr>
        </thead>
        {renderTableBody()}
      </table>
    </div>
  );
};

export default TableView;
