import Modal from "@/components/Modal";
import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useGetAllProjectTypeMilestones from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import useDeleteProjectType from "@/hooks/project-modules/project-types/use-delete-project-type";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";

interface DeleteJourneyModalProps extends ModalProps {
  projectType: ProjectType;
  onSuccess?: () => void;
  onViewMilestones?: () => void;
}

const DeleteJourneyModal = ({
  onClose,
  isOpen,
  projectType,
  onSuccess,
  onViewMilestones,
}: DeleteJourneyModalProps) => {
  const deleteProjectType = useDeleteProjectType(projectType.id);

  const getMilestones = useGetAllProjectTypeMilestones(projectType.id);
  // Check if journey has milestones
  const hasMilestones =
    getMilestones.value?.data?.length && getMilestones.value?.data?.length > 0;

  const handleDelete = () => {
    deleteProjectType
      .mutateAsync({})
      .then(() => {
        onSuccess?.();
        onClose();
      })
      .catch(console.error);
  };

  const handleViewMilestones = () => {
    onViewMilestones?.();
    onClose();
  };

  return (
    <Modal
      title={hasMilestones ? "Cannot Delete Journey" : "Delete Journey"}
      closeModal={onClose}
      isOpen={isOpen}
    >
      <div className="p-3 space-y-4">
        {hasMilestones ? (
          <p className="text-gray-500 text-sm">
            This journey contains one or more milestones. Please delete all milestones
            before deleting the journey.
          </p>
        ) : (
          <p className="text-gray-500 text-sm">
            Are you sure you want to delete this journey? This action cannot be undone.
          </p>
        )}

        <div className="flex gap-3 items-center justify-end pt-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {hasMilestones ? (
            <Button size="sm" variant="default" onClick={handleViewMilestones}>
              View Milestones
            </Button>
          ) : (
            <Button
              size="sm"
              variant="destructive"
              isLoading={deleteProjectType.isPending}
              onClick={handleDelete}
            >
              Delete Journey
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteJourneyModal;
