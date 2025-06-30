import { Button } from "@/components/ui/button";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import { IoAdd } from "react-icons/io5";
import AddNoteTypeModal from "./add-note-type-modal";
import NoteTypeTable from "./note-table";

const NoteTab = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-[16px] font-[600]">Note type </h1>
        <Button onClick={onOpen} size="sm" leftIcon={<IoAdd className="text-white" />}>
          Add note type
        </Button>
      </div>
      <NoteTypeTable />
      {/* Modal to add note type */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && <AddNoteTypeModal isOpen={isOpen} onClose={onClose} />}
      </AnimatePresence>
    </>
  );
};

export default NoteTab;
