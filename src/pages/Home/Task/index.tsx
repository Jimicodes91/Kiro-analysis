import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import useGetAllTasks from "@/hooks/project-modules/tasks/use-get-all-tasks";
import useDebounce from "@/hooks/use-debounce";
import useDisclosure from "@/hooks/use-disclosure";
import React, { useState } from "react";
import { IoAdd, IoSearchOutline } from "react-icons/io5";
import AddTaskModal from "./add-task-modal";
import TaskEmptyState from "./task-empty-state";
import TasksTable from "./task-table";

const Task: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
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
      <div className="mx-6 my-2">
        <div className="flex justify-between items-center my-4">
          <div className="flex items-center gap-4">
            <Heading size="h3">Task</Heading>
            <div className="relative w-full min-w-[300px] bg-[#F3F3F3] rounded-full">
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
              onClick={onOpen}
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

      {isOpen && <AddTaskModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default Task;
