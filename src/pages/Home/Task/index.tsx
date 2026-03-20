import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import useGetAllTasks from "@/hooks/project-modules/tasks/use-get-all-tasks";
import useDebounce from "@/hooks/use-debounce";
import React, { useState } from "react";
import { IoAdd, IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import TaskEmptyState from "./task-empty-state";
import TasksTable from "./task-table";

const Task: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearchQuery] = useState("");

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
            <Heading size="h3">Task</Heading>
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
              onClick={() => navigate("/task/new")}
            >
              Add task
            </Button>
          </div>
        </div>
        {Array.isArray(tasksResponse?.data?.data?.data) && tasks.length === 0 ? (
          <TaskEmptyState />
        ) : (
          <TasksTable search={debounceText} />
        )}
      </div>
    </>
  );
};

export default Task;
