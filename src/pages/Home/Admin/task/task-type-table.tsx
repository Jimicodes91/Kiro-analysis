import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllTaskTypes from "@/hooks/project-modules/task-types/use-get-all-task-types";
import TaskTypeTableRow from "./task-type-table-row";

const TaskTypeTable = () => {
  const taskTypes = useGetAllTaskTypes();

  const renderTableBody = () => {
    if (taskTypes.isPending) return <TableSkeletonRowLoader length={3} />;

    if (taskTypes?.isError)
      return <EmptyTable message="Something went wrong" length={3} />;

    if (taskTypes?.value?.data?.length === 0)
      return <EmptyTable message="No Task type found" length={3} />;

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={7}></TableCell>
        </TableRow>
        <>
          {taskTypes?.value?.data?.map((taskType) => (
            <TaskTypeTableRow key={taskType.id} taskType={taskType} />
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
              <TableHead>Type name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>
    </div>
  );
};

export default TaskTypeTable;
