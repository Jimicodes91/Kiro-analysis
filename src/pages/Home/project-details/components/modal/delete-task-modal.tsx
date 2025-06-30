import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useDeleteTask from "@/hooks/project-modules/tasks/use-delete-task";
import Modal from "../../../../../components/Modal";

const DeleteTaskModal = ({
  onClose,
  projectId,
  isOpen,
  taskId,
}: {
  projectId: string;
  taskId: string;
} & ModalProps) => {
  const deleteTask = useDeleteTask(projectId, taskId);

  const removeMemberHandler = () => {
    deleteTask
      .mutateAsync({})
      .then(() => {
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal title="Delete Task" closeModal={onClose} isOpen={isOpen}>
        <div className="p-3 space-y-4">
          <p className="text-gray-500 text-sm">
            Are you sure you want to delete this task from the project? This action cannot
            be undone and all related data will be permanently removed.
          </p>
          <div className="flex gap-3 items-center justify-end">
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              isLoading={deleteTask.isPending}
              onClick={removeMemberHandler}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteTaskModal;
