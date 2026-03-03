import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useDisclosure from "@/hooks/use-disclosure";
import { truncateMiddleWords } from "@/lib/utils";
import { Attachment } from "@/types/api.types";
import { AnimatePresence } from "framer-motion";
import { File, Trash, Upload } from "lucide-react";
import DeleteDocumentAttachmentModal from "../modal/delete-document-attachment";

function AttachmentCard({
  attachment,
  projectId,
  isClientView = false,
}: {
  attachment: Attachment;
  projectId: string;
  isClientView?: boolean;
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <div className="p-4 border border-brand-border bg-white rounded-lg flex justify-between">
        <div className="flex gap-2 items-center">
          <File className="h-5" />
          <p className="font-xs text-gray-600">
            {truncateMiddleWords(attachment?.media_url)}
          </p>
        </div>
        <div className="flex gap-1">
          <a
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            href={attachment?.media_url}
            download
            target="_blank"
          >
            <Upload className="h-5" />
          </a>

          {!isClientView && (
            <>
              <Separator orientation="vertical" />
              <Button variant="ghost" size="icon" onClick={onOpen}>
                <Trash className="h-5" />
              </Button>
            </>
          )}
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <DeleteDocumentAttachmentModal
            isOpen={isOpen}
            attachmentId={attachment.id}
            documentId={attachment.document_id}
            projectId={projectId}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default AttachmentCard;
