import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import AddDocumentModal from "./add-document-model";
import DocumentTable from "./document-table";

const DocumentTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <h1 className="text-[16px] font-[600]">Document type </h1>
        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<IoAdd className="text-white" />}
        >
          Document type
        </Button>
      </div>
      <DocumentTable />
      {/* Modal to add document type */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isModalOpen && (
          <AddDocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default DocumentTab;
