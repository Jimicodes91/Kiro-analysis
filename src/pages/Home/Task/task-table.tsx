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
import { Task } from "@/types/task.types";
import { useMemo } from "react";
import TaskTableRow from "./task-table-row";

interface TasksTableProps {
  search: string;
  statusFilter?: string;
  typeFilter?: string;
  showArchived?: boolean;
  onTaskClick?: (task: Task) => void;
}

const TasksTable = ({ search, statusFilter, typeFilter, showArchived, onTaskClick }: TasksTableProps) => {
  const tasksResponse = useGetAllTasks(search);
  const rawTasks: Task[] = Array.isArray(tasksResponse?.data?.data?.data)
    ? tasksResponse.data.data.data
    : [];

  const tasks = useMemo(() => {
    let filtered = rawTasks;
    if (!showArchived) {
      filtered = filtered.filter((t) => t.status !== "archived");
    }
    if (statusFilter) {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
    if (typeFilter) {
      filtered = filtered.filter((t) => t.task_category_type === typeFilter);
    }
    return filtered;
  }, [rawTasks, statusFilter, typeFilter, showArchived]);

  const renderTable = () => {
    if (tasksResponse.isPending) {
      return <TableSkeletonRowLoader length={6} />;
    }

    if (tasksResponse?.isError) {
      return <EmptyTable message="Something went wrong" length={6} />;
    }

    if (tasks.length === 0) {
      return <EmptyTable message="No tasks found" length={6} />;
    }

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={6}></TableCell>
        </TableRow>
        {tasks?.map((task) => (
          <TaskTableRow key={task.id} task={task} onTaskClick={onTaskClick} />
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
              <TableHead>Date</TableHead>
              <TableHead>Task Name</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Pipeline</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          {renderTable()}
        </Table>
      </div>
    </div>
  );
};

export default TasksTable;
