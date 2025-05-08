import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useDeleteDocumentAttachment from "@/hooks/project-modules/documents/use-delete-document-attachment";
import Modal from "../../../../../components/Modal";

const DeleteDocumentAttachmentModal = ({
  onClose,
  projectId,
  isOpen,
  documentId,
  attachmentId,
}: {
  projectId: string;
  documentId: string;
  attachmentId: string;
} & ModalProps) => {
  const deleteDocAttachment = useDeleteDocumentAttachment(
    projectId,
    documentId,
    attachmentId
  );

  const deleteDocAttachmentHandler = () => {
    deleteDocAttachment
      .mutateAsync({})
      .then(() => {
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal title="Delete attachment" closeModal={onClose} isOpen={isOpen}>
        <div className="p-3 space-y-4">
          <p className="text-gray-500 text-sm">
            Are you sure you want to delete this attachment from the document group? This
            action cannot be undone and all related data will be permanently removed.
          </p>
          <div className="flex gap-3 items-center justify-end">
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              isLoading={deleteDocAttachment.isPending}
              onClick={deleteDocAttachmentHandler}
            >
              Delete attachment
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteDocumentAttachmentModal;
