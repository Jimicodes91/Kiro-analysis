import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useDeleteEvent from "@/hooks/project-modules/events/use-delete-event";
import Modal from "../../../../../components/Modal";

const DeleteEventModal = ({
  onClose,
  projectId,
  isOpen,
  eventId,
}: {
  projectId: string;
  eventId: string;
} & ModalProps) => {
  const deleteEvent = useDeleteEvent(projectId, eventId);

  const deleteEventHandler = () => {
    deleteEvent
      .mutateAsync({})
      .then(() => {
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal title="Delete Event" closeModal={onClose} isOpen={isOpen}>
        <div className="p-3 space-y-4">
          <p className="text-gray-500 text-sm">
            Are you sure you want to delete this event from the project? This action
            cannot be undone and all related data will be permanently removed.
          </p>
          <div className="flex gap-3 items-center justify-end">
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              isLoading={deleteEvent.isPending}
              onClick={deleteEventHandler}
            >
              Delete Event
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteEventModal;
