import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import useGetAllTasks from "@/hooks/project-modules/tasks/use-get-all-tasks";
import useDisclosure from "@/hooks/use-disclosure";
import React, { useState } from "react";
import { GoShare } from "react-icons/go";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { IoAdd, IoSearchOutline } from "react-icons/io5";
import TaskEmptyState from "./task-empty-state";
// import TaskModal from "./task-modal-form";
import AddTaskModal from "./add-task-modal";
import TasksTable from "./task-table";

const Task: React.FC = () => {
  const [, setSearchQuery] = useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();

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
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex justify-between space-x-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<HiOutlineAdjustmentsVertical className="text-[#111] w-6 h-6" />}
              className="border-black"
            >
              Filter
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<GoShare className="text-[#111] w-6 h-6" />}
              className="border-black"
            >
              Export
            </Button>
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
          <TasksTable />
        )}
      </div>

      {/* {isOpen && <TaskModal isOpen={isOpen} onClose={onClose} mode="create" />} */}
      {isOpen && <AddTaskModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default Task;
