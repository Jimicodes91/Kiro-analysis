import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import useGetAllProjectDocuments from "@/hooks/project-modules/documents/use-get-all-documents";
import useDisclosure from "@/hooks/use-disclosure";
import UploadDocumentModal from "@/pages/Home/project-details/components/modal/upload-document-modal";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import ClientDocumentList from "./components/client-document-list";

export default function ClientDocumentManagement() {
  const { activeProject } = useClientProjectContext();
  const projectId = activeProject?.id ?? "";
  const projectDocs = useGetAllProjectDocuments(projectId);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-5 bg-gray-50 page-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Heading size="h3" className="flex items-center gap-2">
            My Documents
            {!projectDocs?.isPending && (
              <span className="text-lg font-medium text-brand-fade">
                ({projectDocs?.value?.data?.length ?? 0})
              </span>
            )}
          </Heading>
          <p className="text-[#19181980] text-sm">
            View and download your documents, and keep track of expiry dates.
          </p>
        </div>

        <Button size="sm" leftIcon={<Upload />} onClick={onOpen}>
          Upload
        </Button>
      </div>

      <ClientDocumentList projectId={projectId} />

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <UploadDocumentModal
            isOpen={isOpen}
            projectId={projectId}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
