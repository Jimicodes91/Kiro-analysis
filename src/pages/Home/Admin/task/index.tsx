import { Button } from "@/components/ui/button";
import React from "react";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import TaskTypeTable from "./task-type-table";

const TaskTab: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-[16px] font-[600]">Task type </h1>
        <Button
          onClick={() => navigate("/task/new/internal?from=admin")}
          size="sm"
          leftIcon={<IoAdd className="text-white" />}
        >
          Create Task
        </Button>
      </div>
      <TaskTypeTable />
    </>
  );
};

export default TaskTab;
