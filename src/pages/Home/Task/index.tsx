import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
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
import React, { useState } from "react";
import { IoAdd, IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import TaskEmptyState from "./task-empty-state";
import TasksTable from "./task-table";
import { TASK_CATEGORY_TYPE_OPTIONS } from "./type-fields";

const Task: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [contextFilter, setContextFilter] = useState<"all" | "organization" | "project">("all");

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
              onClick={() => navigate("/task/new/internal")}
            >
              Add task
            </Button>
          </div>
        </div>

        {/* Context filter tabs */}
        <div className="flex gap-1 bg-[#F3F3F3] rounded-full p-1 w-fit mb-4">
          {(["all", "organization", "project"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                contextFilter === value
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setContextFilter(value)}
            >
              {value === "all"
                ? "All Tasks"
                : value === "organization"
                  ? "Organization Tasks"
                  : "Project Tasks"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9 rounded-full border-brand-border text-sm">
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
            <SelectTrigger className="w-[180px] h-9 rounded-full border-brand-border text-sm">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {TASK_CATEGORY_TYPE_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <Checkbox
              checked={showArchived}
              onCheckedChange={(v) => setShowArchived(v === true)}
            />
            Show archived
          </label>
        </div>

        {Array.isArray(tasksResponse?.data?.data?.data) && tasks.length === 0 ? (
          <TaskEmptyState />
        ) : (
          <TasksTable
            search={debounceText}
            statusFilter={statusFilter === "all" ? "" : statusFilter}
            typeFilter={typeFilter === "all" ? "" : typeFilter}
            showArchived={showArchived}
            contextFilter={contextFilter}
          />
        )}
      </div>
    </>
  );
};

export default Task;
