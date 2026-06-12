import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { TaskStatusBadge } from "@/components/ui/task-status-badge";
import useUpdateTask from "@/hooks/project-modules/tasks/use-update-task";
import { getUTCISODateFormat } from "@/lib/utils";
import { Task } from "@/types/task.types";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TaskComments from "./task-comments";

const STATUS_ROW_COLORS: Record<string, string> = { in_progress: "bg-amber-50", completed: "bg-green-50", archived: "bg-slate-100" };
export function getStatusRowColor(status: string): string { return STATUS_ROW_COLORS[status] ?? ""; }
const CATEGORY_TYPE_LABELS: Record<string, string> = { signing: "Signing", information_request: "Info Request", document_upload: "Doc Upload", activity: "Activity", review: "Review", meeting: "Meeting", task: "Task", follow_up: "Follow Up", message: "Message" };
function formatDate(value: string | undefined | null): string { if (!value) return "—"; try { return format(new Date(value), "dd MMM, yyyy"); } catch { return "—"; } }

interface TaskTableRowProps { task: Task; visibleColumns: string[]; }

function TaskTableRow({ task, visibleColumns }: TaskTableRowProps) {
  const rowColor = getStatusRowColor(task.status);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(task.name);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const updateTask = useUpdateTask(task.project_id ?? null, task.id);
  const deleteTask = useDeleteTask(task.project_id ?? null, task.id);

  useEffect(() => { if (!isEditingName) setNameValue(task.name); }, [task.name, isEditingName]);
  useEffect(() => { if (isEditingName && nameInputRef.current) { nameInputRef.current.focus(); nameInputRef.current.select(); } }, [isEditingName]);

  const handleNameClick = (e: React.MouseEvent) => { e.stopPropagation(); setIsEditingName(true); };
  const handleNameSubmit = () => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== task.name) { updateTask.mutateAsync({ name: trimmed }).catch(() => setNameValue(task.name)); } else { setNameValue(task.name); }
    setIsEditingName(false);
  };
  const handleNameKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleNameSubmit(); else if (e.key === "Escape") { setNameValue(task.name); setIsEditingName(false); } };
  const handleDateSelect = (date: Date | undefined) => { if (date) { updateTask.mutateAsync({ due_date: getUTCISODateFormat(date) }).catch(() => {}); } setDatePickerOpen(false); };
  const handleStatusChange = (newStatus: string) => { if (newStatus !== task.status) { updateTask.mutateAsync({ status: newStatus }).catch(() => {}); } };

  const categoryLabel = task.task_category_type ? CATEGORY_TYPE_LABELS[task.task_category_type] ?? task.task_category_type : "—";
  const currentDueDate = task.due_date || task.end_date;

  const renderCell = (columnId: string) => {
    switch (columnId) {
      case "done":
        return (
          <TableCell key={columnId} className="w-10 cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            const newStatus = task.status === "completed" ? "draft" : "completed";
            updateTask.mutateAsync({ status: newStatus }).catch(() => {});
          }}>
            <span className={`inline-block h-4 w-4 rounded-full border-2 ${task.status === "completed" ? "bg-green-500 border-green-500" : "border-gray-400"}`} />
          </TableCell>
        );
      case "subject":
        return (
          <TableCell key={columnId} className="cursor-pointer" onClick={handleNameClick}>
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input ref={nameInputRef} type="text" value={nameValue} onChange={(e) => setNameValue(e.target.value)} onBlur={handleNameSubmit} onKeyDown={handleNameKeyDown} className="w-full rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400" onClick={(e) => e.stopPropagation()} />
                {updateTask.isPending && <Loader2 className="h-3 w-3 animate-spin text-gray-400" />}
              </div>
            ) : (
              <span className="flex items-center gap-1">{task.name}{updateTask.isPending && <Loader2 className="h-3 w-3 animate-spin text-gray-400" />}</span>
            )}
          </TableCell>
        );
      case "project":
        return (
          <TableCell key={columnId}>
            {task.project ? (
              <Link
                to={`/projects/${task.project.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
                onClick={(e) => e.stopPropagation()}
              >
                {task.project.name}
              </Link>
            ) : (
              "—"
            )}
          </TableCell>
        );
      case "contact_person":
        return <TableCell key={columnId}>{task.contact?.name ?? "—"}</TableCell>;
      case "due_date":
        return (
          <TableCell key={columnId} onClick={(e) => e.stopPropagation()}>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <span className="cursor-pointer hover:underline">{currentDueDate || "—"}</span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={currentDueDate ? new Date(currentDueDate) : undefined} onSelect={handleDateSelect} />
              </PopoverContent>
            </Popover>
          </TableCell>
        );
      case "category":
        return <TableCell key={columnId}>{categoryLabel}</TableCell>;
      case "status":
        return (
          <TableCell key={columnId} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1">
              <TaskStatusBadge status={task.status} signingStatus={task.task_category_type === "signing" ? task.signing_status : undefined} dueDate={currentDueDate} />
              {task.status !== "completed" && (
                <button
                  type="button"
                  className="text-[10px] text-gray-400 hover:text-green-600 ml-1"
                  title="Mark as completed"
                  onClick={() => handleStatusChange("completed")}
                >✓</button>
              )}
            </div>
          </TableCell>
        );
      case "priority":
        return <TableCell key={columnId}>{task.priority ?? "—"}</TableCell>;
      case "email":
        return <TableCell key={columnId}>{task.contact?.email ?? "—"}</TableCell>;
      case "phone":
        return <TableCell key={columnId}>{task.contact?.phone ?? "—"}</TableCell>;
      case "organization":
        return <TableCell key={columnId}>{task.contact?.organization ?? "—"}</TableCell>;
      case "assignee":
        return <TableCell key={columnId}>{task.assignees?.map((a) => a.name ?? a.email).join(", ") || "—"}</TableCell>;
      case "note":
        return <TableCell key={columnId} className="max-w-[200px] truncate">{task.description || "—"}</TableCell>;
      case "created":
        return <TableCell key={columnId}>{formatDate(task.created_at)}</TableCell>;
      default:
        return null;
    }
  };

  return (
    <>
      <TableRow className={rowColor}>
        <TableCell className="w-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
          {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
        </TableCell>
        {visibleColumns.map(renderCell)}
        <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete task"
            onClick={() => {
              if (confirm("Delete this task?")) {
                deleteTask.mutateAsync({}).catch(() => {});
              }
            }}
          >
            {deleteTask.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={visibleColumns.length + 2} className="bg-gray-50 p-4">
            <TaskComments projectId={task.project_id ?? ""} taskId={task.id} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default TaskTableRow;
