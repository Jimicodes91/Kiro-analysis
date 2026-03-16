import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllTasks from "@/hooks/project-modules/tasks/use-get-all-tasks";
import TaskTableRow from "./task-table-row";

const TasksTable = ({ search }: { search: string }) => {
  const tasksResponse = useGetAllTasks(search);
  const tasks = Array.isArray(tasksResponse?.data?.data?.data)
    ? tasksResponse.data.data.data
    : [];

  const renderTable = () => {
    if (tasksResponse.isPending) {
      return <TableSkeletonRowLoader length={7} />;
    }

    if (tasksResponse?.isError) {
      return <EmptyTable message="Something went wrong" length={7} />;
    }

    if (tasks.length === 0) {
      return <EmptyTable message="No tasks found" length={7} />;
    }

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={7}></TableCell>
        </TableRow>
        {tasks?.map((task) => <TaskTableRow key={task.id} task={task} />)}
      </TableBody>
    );
  };

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="bg-brand-table col-span-12 rounded-lg p-1 border border-gray-200">
        <Table className="overflow-auto">
          <TableHeader>
            <TableRow className="hover:bg-[#EAECEC] rounded-full border border-[#D3D4D4]">
              <TableHead>Task name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Project title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          {renderTable()}
        </Table>
      </div>
    </div>
  );
};

export default TasksTable;
