import { Button } from "@/components/ui/button";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { IoAdd } from "react-icons/io5";
import AddDocumentModal from "./add-document-type-model";
import DocumentTypeTable from "./document-type-table";

const DocumentTab: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-[16px] font-[600]">Document type </h1>
        <Button size="sm" onClick={onOpen} leftIcon={<IoAdd className="text-white" />}>
          Document type
        </Button>
      </div>
      <DocumentTypeTable />
      {/* Modal to add document type */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && <AddDocumentModal isOpen={isOpen} onClose={onClose} />}
      </AnimatePresence>
    </>
  );
};

export default DocumentTab;
