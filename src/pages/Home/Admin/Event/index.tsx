import { Button } from "@/components/ui/button";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { IoAdd } from "react-icons/io5";
import AddEventTypeModal from "./add-event-type-modal";
import EventTypeTable from "./event-type-table";

const EventTab: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-[16px] font-[600]">Event type </h1>
        <Button size="sm" onClick={onOpen} leftIcon={<IoAdd className="text-white" />}>
          Add event type
        </Button>
      </div>
      <EventTypeTable />
      {/* Modal to add Event type */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && <AddEventTypeModal isOpen={isOpen} onClose={onClose} />}
      </AnimatePresence>
    </>
  );
};

export default EventTab;
