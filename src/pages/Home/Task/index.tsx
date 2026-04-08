import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useGetAllTasks from "@/hooks/project-modules/tasks/use-get-all-tasks";
import useDebounce from "@/hooks/use-debounce";
import { taskStatuses } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useState } from "react";
import { IoAdd, IoSearchOutline } from "react-icons/io5";
import ActivityFormModal from "./activity-form-modal";
import TaskEmptyState from "./task-empty-state";
import TasksTable from "./task-table";
import { TASK_CATEGORY_TYPE_OPTIONS } from "./type-fields";

const Task: React.FC = () => {
  const [search, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [periodOpen, setPeriodOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const debounceText = useDebounce(search, 1000);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const tasksResponse = useGetAllTasks();
  const tasks = Array.isArray(tasksResponse?.data?.data?.data)
    ? tasksResponse.data.data.data
    : [];

  return (
    <>
      <div className="p-3 sm:p-4 md:p-6 my-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 my-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Heading size="h3">Tasks</Heading>
            <div className="relative flex-1 sm:flex-initial sm:min-w-[200px] md:min-w-[300px] bg-[#F3F3F3] rounded-full">
              <IoSearchOutline className="absolute top-[50%] -translate-y-[50%] left-3 text-[#808080]" />
              <Input
                placeholder="Search keyword"
                className="w-full pl-8 text-[#00000080]"
                type="search"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex justify-between space-x-2">
            <Button
              size="sm"
              leftIcon={<IoAdd className="text-white w-6 h-6" />}
              onClick={() => setIsActivityModalOpen(true)}
            >
              Add task
            </Button>
          </div>
        </div>

        {/* Filters row: status/type/archived on left, time filters on right */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-8 rounded-full border-brand-border text-xs">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {taskStatuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] h-8 rounded-full border-brand-border text-xs">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {TASK_CATEGORY_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <Checkbox
                checked={showArchived}
                onCheckedChange={(v) => setShowArchived(v === true)}
              />
              Show archived
            </label>
          </div>

          <div className="flex items-center gap-1 text-xs overflow-x-auto">
            {[
              { value: "todo", label: "To-do" },
              { value: "overdue", label: "Overdue" },
              { value: "today", label: "Today" },
              { value: "tomorrow", label: "Tomorrow" },
              { value: "this_week", label: "This week" },
              { value: "next_week", label: "Next week" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                className={cn(
                  "px-2.5 py-1 rounded-full whitespace-nowrap transition-colors",
                  timeFilter === item.value
                    ? "bg-black text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => { setTimeFilter(timeFilter === item.value ? "all" : item.value); setDateRange({ from: null, to: null }); }}
              >
                {item.label}
              </button>
            ))}
            <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "px-2.5 py-1 rounded-full whitespace-nowrap transition-colors",
                    timeFilter === "custom"
                      ? "bg-black text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {timeFilter === "custom" && dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`
                    : "Select period"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">From</p>
                      <Calendar
                        mode="single"
                        selected={dateRange.from ?? undefined}
                        onSelect={(d) => setDateRange((prev) => ({ ...prev, from: d ?? null }))}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">To</p>
                      <Calendar
                        mode="single"
                        selected={dateRange.to ?? undefined}
                        onSelect={(d) => setDateRange((prev) => ({ ...prev, to: d ?? null }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => { setDateRange({ from: null, to: null }); setTimeFilter("all"); setPeriodOpen(false); }}>Cancel</Button>
                    <Button size="sm" disabled={!dateRange.from || !dateRange.to} onClick={() => { setTimeFilter("custom"); setPeriodOpen(false); }}>Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {Array.isArray(tasksResponse?.data?.data?.data) && tasks.length === 0 ? (
          <TaskEmptyState />
        ) : (
          <TasksTable
            search={debounceText}
            statusFilter={statusFilter === "all" ? "" : statusFilter}
            typeFilter={typeFilter === "all" ? "" : typeFilter}
            showArchived={showArchived}
            timeFilter={timeFilter}
            dateRange={timeFilter === "custom" ? dateRange : undefined}
          />
        )}
      </div>

      {isActivityModalOpen && (
        <ActivityFormModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
        />
      )}
    </>
  );
};

export default Task;
