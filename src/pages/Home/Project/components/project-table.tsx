import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
              <TableHead>Project client(s)</TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>
    </div>
  );
};

export default ProjectTable;
