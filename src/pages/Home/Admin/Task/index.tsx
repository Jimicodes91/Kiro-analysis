import { Button } from "@/components/ui/button";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { IoAdd } from "react-icons/io5";
import AddTaskTypeModal from "./add-task-type-modal";
import TaskTypeTable from "./task-type-table";

const TaskTab: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <div className="flex justify-between items-center my-6">
        <h1 className="text-[16px] font-[600]">Task type </h1>
        <Button onClick={onOpen} leftIcon={<IoAdd className="text-white" />}>
          Add task type
        </Button>
      </div>
      <TaskTypeTable />
      {/* Modal to add document type */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && <AddTaskTypeModal onClose={onClose} />}
      </AnimatePresence>
    </>
  );
};

export default TaskTab;
