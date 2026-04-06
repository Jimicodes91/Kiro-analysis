import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { TaskStatusBadge } from "@/components/ui/task-status-badge";
import useUpdateTask from "@/hooks/project-modules/tasks/use-update-task";
import { taskStatuses } from "@/lib/constants";
import { getUTCISODateFormat } from "@/lib/utils";
import { Task } from "@/types/task.types";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TaskComments from "./task-comments";

const STATUS_ROW_COLORS: Record<string, string> = { in_progress: "bg-amber-50", completed: "bg-green-50", archived: "bg-slate-100" };
export function getStatusRowColor(status: string): string { return STATUS_ROW_COLORS[status] ?? ""; }
const CATEGORY_TYPE_LABELS: Record<string, string> = { signing: "Signing", information_request: "Info Request", document_upload: "Doc Upload", review: "Review", approval: "Approval", meeting: "Meeting", follow_up: "Follow-up" };
function formatDate(value: string | undefined | null): string { if (!value) return "—"; try { return format(new Date(value), "dd MMM, yyyy"); } catch { return "—"; } }

interface TaskTableRowProps { task: Task; }

function TaskTableRow({ task }: TaskTableRowProps) {
  const rowColor = getStatusRowColor(task.status);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(task.name);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const updateTask = useUpdateTask(task.project_id ?? null, task.id);

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
  const currentDueDate = task.due_date ?? task.end_date;

  return (
    <>
      <TableRow className={rowColor}>
        <TableCell className="w-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
          {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
        </TableCell>
        <TableCell>{formatDate(task.created_at)}</TableCell>
        <TableCell className="cursor-pointer" onClick={handleNameClick}>
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input ref={nameInputRef} type="text" value={nameValue} onChange={(e) => setNameValue(e.target.value)} onBlur={handleNameSubmit} onKeyDown={handleNameKeyDown} className="w-full rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400" onClick={(e) => e.stopPropagation()} />
              {updateTask.isPending && <Loader2 className="h-3 w-3 animate-spin text-gray-400" />}
            </div>
          ) : (
            <span className="flex items-center gap-1">{task.name}{updateTask.isPending && <Loader2 className="h-3 w-3 animate-spin text-gray-400" />}</span>
          )}
        </TableCell>
        <TableCell>{categoryLabel}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <span className="cursor-pointer hover:underline">{formatDate(currentDueDate)}</span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={currentDueDate ? new Date(currentDueDate) : undefined} onSelect={handleDateSelect} />
            </PopoverContent>
          </Popover>
        </TableCell>
        <TableCell>{task.pipeline?.name ?? "—"}</TableCell>
        <TableCell>{task.project?.name ?? "—"}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-7 w-[130px] rounded-full border-0 bg-transparent p-0 text-xs shadow-none focus:ring-0 cursor-pointer">
              <SelectValue>
                <TaskStatusBadge status={task.status} signingStatus={task.task_category_type === "signing" ? task.signing_status : undefined} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {taskStatuses.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={8} className="bg-gray-50 p-4">
            <TaskComments projectId={task.project_id ?? ""} taskId={task.id} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default TaskTableRow;
