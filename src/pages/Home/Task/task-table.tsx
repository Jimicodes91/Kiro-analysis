import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskTableRow from "./task-table-row";
import { useTaskData } from "./use-task-data";
// import TableSkeletonRowLoader from "@/components/ui/table-row-skeleton";

const TasksTable = () => {
  const {
    tasks,
    //  loading
  } = useTaskData();

  const renderTableBody = () => {
    // if (loading) return <TableSkeletonRowLoader length={7} />;

    return (
      <>
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={7}></TableCell>
        </TableRow>
        {tasks.map((task) => (
          <TaskTableRow key={task.id} task={task} />
        ))}
      </>
    );
  };

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="bg-brand-table col-span-12 rounded-lg p-1 border border-gray-200">
        <Table className="overflow-auto">
          <TableHeader>
            <TableRow className="hover:bg-[#EAECEC] rounded-full border border-[#D3D4D4]">
              <TableHead>Task name</TableHead>
              <TableHead>Client name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">{renderTableBody()}</TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TasksTable;
