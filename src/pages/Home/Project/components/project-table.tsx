import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow
} from "../../../../components/ui/table";
import TableSkeletonRowLoader, {
    EmptyTable,
} from "../../../../components/ui/table-row-skeleton";
import ProjectTableRow from "./project-table-row";

interface ProjectTableProps {
  projectData: ReturnType<typeof useGetAllProjects>;
}

const ProjectTable = ({ projectData }: ProjectTableProps) => {
  const renderTableBody = () => {
    if (projectData.isPending) return <TableSkeletonRowLoader length={7} />;

    if (projectData?.value?.data?.length === 0)
      return <EmptyTable message="No projects found" length={7} />;

    return (
      <TableBody className="text-sm">
        {projectData?.value?.data?.map((project) => (
          <ProjectTableRow key={project.id} project={project} />
        ))}
      </TableBody>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Title
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Organization
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Start date
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              End date
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Completed
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Client(s)
            </TableHead>
          </TableRow>
        </TableHeader>
        {renderTableBody()}
      </Table>
    </div>
  );
};

export default ProjectTable;
