import { Button } from "@/components/ui/button";
import ViewToggle from "@/components/ui/view-toggle";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import React from "react";
import DocumentCard from "../components/cards/document-card";
import RequestDocumentModal from "../components/modal/request-document-modal";
import UploadDocumentModal from "../components/modal/upload-document-modal";

function ProjectDocumentSection({ projectId }: { projectId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = React.useState("Official");

  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();
  return (
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <div className="flex items-center gap-3 justify-between">
          <div className="w-fit">
            <ViewToggle
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              options={[
                { value: "Official", label: "Official" },
                { value: "Request", label: "Request" },
              ]}
            />
          </div>

          <div className="flex gap-3 items-center">
            <Button size="sm" variant="outline" onClick={onOpen}>
              Request
            </Button>
            <Button size="sm" leftIcon={<Upload />} onClick={onUploadOpen}>
              Upload
            </Button>
          </div>
        </div>

        <div>
          <DocumentCard />
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <RequestDocumentModal isOpen={isOpen} projectId={projectId} onClose={onClose} />
        )}
        {isUploadOpen && (
          <UploadDocumentModal
            isOpen={isUploadOpen}
            projectId={projectId}
            onClose={onUploadClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectDocumentSection;
