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
import { addWeeks, differenceInDays, endOfWeek, isPast, isToday, isTomorrow, startOfWeek } from "date-fns";
import { Settings } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ALL_COLUMNS, getVisibleColumns, setVisibleColumns } from "./column-config";
import ColumnCustomizerModal from "./column-customizer-modal";
import TaskTableRow from "./task-table-row";

interface TasksTableProps {
  search: string;
  statusFilter?: string;
  typeFilter?: string;
  showArchived?: boolean;
  contextFilter?: "all" | "organization" | "project";
  timeFilter?: string;
  dateRange?: { from: Date | null; to: Date | null };
}

const TasksTable = ({ search, statusFilter, typeFilter, showArchived, contextFilter, timeFilter, dateRange }: TasksTableProps) => {
  const contextParam = contextFilter && contextFilter !== "all" ? contextFilter : undefined;

  const [visibleColumns, setVisibleColumnsState] = useState<string[]>(getVisibleColumns);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const columnCount = visibleColumns.length + 2; // +1 for chevron, +1 for delete

  const tasksResponse = useGetAllTasks(search, contextParam, showArchived);
  const rawTasks: Task[] = Array.isArray(tasksResponse?.data?.data?.data)
    ? tasksResponse.data.data.data
    : [];

  // Auto-archive: move completed tasks to "archived" after 3 days
  const autoArchiveRef = useRef(false);
  useEffect(() => {
    if (autoArchiveRef.current || rawTasks.length === 0) return;
    autoArchiveRef.current = true;

    const now = new Date();
    const tasksToArchive = rawTasks.filter((t) => {
      if (t.status !== "completed") return false;
      const completedDate = t.completed_at || t.updated_at;
      if (!completedDate) return false;
      return differenceInDays(now, new Date(completedDate)) >= 3;
    });

    if (tasksToArchive.length > 0) {
      import("@/services/api.service").then(({ secureRequest }) => {
        const baseUrl = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/?$/, "/");
        tasksToArchive.forEach((t) => {
          const endpoint = t.project_id
            ? `projects/${t.project_id}/tasks/${t.id}`
            : `tasks/${t.id}`;
          secureRequest({
            url: baseUrl + endpoint,
            method: "patch",
            body: { status: "archived" },
          }).catch(() => {});
        });
      });
    }
  }, [rawTasks]);

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
    // Time period filter based on due_date
    if (timeFilter && timeFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((t) => {
        const dueRaw = t.due_date ?? t.end_date;
        if (!dueRaw) return timeFilter === "todo"; // no due date = todo
        const due = new Date(dueRaw);
        switch (timeFilter) {
          case "todo": return t.status !== "completed" && t.status !== "archived";
          case "overdue": return isPast(due) && !isToday(due) && t.status !== "completed" && t.status !== "archived";
          case "today": return isToday(due);
          case "tomorrow": return isTomorrow(due);
          case "this_week": return due >= startOfWeek(now, { weekStartsOn: 1 }) && due <= endOfWeek(now, { weekStartsOn: 1 });
          case "next_week": { const nw = addWeeks(now, 1); return due >= startOfWeek(nw, { weekStartsOn: 1 }) && due <= endOfWeek(nw, { weekStartsOn: 1 }); }
          case "custom": return dateRange?.from && dateRange?.to ? due >= dateRange.from && due <= dateRange.to : true;
          default: return true;
        }
      });
    }
    return filtered;
  }, [rawTasks, statusFilter, typeFilter, showArchived, timeFilter, dateRange]);

  const handleColumnsChange = useCallback((columns: string[]) => {
    setVisibleColumnsState(columns);
    setVisibleColumns(columns);
  }, []);

  // Build visible column configs in order
  const visibleColumnConfigs = useMemo(() => {
    const idSet = new Set(visibleColumns);
    return ALL_COLUMNS.filter((c) => idSet.has(c.id));
  }, [visibleColumns]);

  const renderTable = () => {
    if (tasksResponse.isPending) {
      return <TableSkeletonRowLoader length={columnCount} />;
    }

    if (tasksResponse?.isError) {
      return <EmptyTable message="Something went wrong" length={columnCount} />;
    }

    if (tasks.length === 0) {
      return <EmptyTable message="No tasks found" length={columnCount} />;
    }

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={columnCount}></TableCell>
        </TableRow>
        {tasks?.map((task) => (
          <TaskTableRow key={task.id} task={task} visibleColumns={visibleColumnConfigs.map(c => c.id)} />
        ))}
      </TableBody>
    );
  };

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="bg-brand-table col-span-12 rounded-lg p-1 border border-gray-200">
        <Table className="overflow-auto w-full">
          <TableHeader>
            <TableRow className="hover:bg-[#EAECEC] rounded-full border border-[#D3D4D4]">
              <TableHead className="w-10">
                <button
                  onClick={() => setIsCustomizerOpen(true)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Customize columns"
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                </button>
              </TableHead>
              {visibleColumnConfigs.map((col) => (
                <TableHead key={col.id} className={col.id === "done" ? "w-10" : col.id === "subject" ? "min-w-[180px]" : col.id === "note" ? "min-w-[150px] max-w-[200px]" : ""}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          {renderTable()}
        </Table>
      </div>

      <ColumnCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        visibleColumns={visibleColumns}
        onColumnsChange={handleColumnsChange}
      />
    </div>
  );
};

export default TasksTable;
