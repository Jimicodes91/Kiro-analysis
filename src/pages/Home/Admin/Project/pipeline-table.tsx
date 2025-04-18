import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import PipeLineTableRow from "./pipeline-table-row";

const PipeLineTable = () => {
  const projectTypes = useGetAllProjectTypes();
  const renderTableBody = () => {
    if (projectTypes.isPending) return <TableSkeletonRowLoader length={3} />;

    if (projectTypes?.value?.data?.length === 0)
      return <EmptyTable message="No pipline found" length={3} />;

    return (
      <TableBody>
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={3}></TableCell>
        </TableRow>
        <>
          {projectTypes?.value?.data?.map((projectType, index) => (
            <PipeLineTableRow
              key={projectType.id}
              projectType={projectType}
              index={index}
            />
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
            <TableRow className="hover:bg-[#EAECEC] rounded-full border border-[#D3D4D4]">
              <TableHead>Pipeline</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>
    </div>
  );
};

export default PipeLineTable;
