import { Button } from "@/components/ui/button";
import ViewToggle from "@/components/ui/view-toggle";
import useGetAllProjectDocuments from "@/hooks/project-modules/documents/use-get-all-documents";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import React from "react";
import DocumentCard from "../components/cards/document-card";
import RequestDocumentModal from "../components/modal/request-document-modal";
import UploadDocumentModal from "../components/modal/upload-document-modal";

function ProjectDocumentSection({
  projectId,
  isClient,
}: {
  projectId: string;
  isClient?: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = React.useState("Official");
  const projectDocs = useGetAllProjectDocuments(projectId);

  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();

  const renderBody = () => {
    if (projectDocs.isPending)
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              className="px-5 py-10 space-y-2 h-[400px] rounded-lg bg-slate-200 flex justify-between  animate-pulse"
              key={i}
            ></div>
          ))}
        </div>
      );

    if (projectDocs?.isError)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    if (projectDocs?.value?.data?.length === 0)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">
            No document currently on this project
          </p>
        </div>
      );

    return (
      <div className="space-y-2">
        {projectDocs?.value?.data?.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>
    );
  };

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

          {!isClient && (
            <div className="flex gap-3 items-center">
              <Button size="sm" variant="outline" onClick={onOpen}>
                Request
              </Button>
              <Button size="sm" leftIcon={<Upload />} onClick={onUploadOpen}>
                Upload
              </Button>
            </div>
          )}
        </div>

        <div>{renderBody()}</div>
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
