import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useRemoveProjectMember from "@/hooks/project-modules/project-members/use-remove-project-member";
import { Member } from "@/types/api.types";
import Modal from "../../../../../components/Modal";

const RemoveTeamMemberModal = ({
  onClose,
  projectId,
  isOpen,
  member,
}: {
  projectId: string;
  member: Member;
} & ModalProps) => {
  const removeMember = useRemoveProjectMember(projectId, member?.id);

  const removeMemberHandler = () => {
    removeMember
      .mutateAsync({})
      .then(() => {
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal title="Remove Project Team" closeModal={onClose} isOpen={isOpen}>
        <div className="p-3 space-y-4">
          <p className="text-gray-500 text-sm">
            Are you sure you want to remove{" "}
            <span className="font-bold text-primary">
              {member?.creator?.name ?? member?.creator?.email}
            </span>
            , from this project? They will lose access to all associated tasks, files, and
            updates. This action cannot be undone.
          </p>
          <div className="flex gap-3 items-center justify-end">
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              isLoading={removeMember.isPending}
              onClick={removeMemberHandler}
            >
              Remove member
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RemoveTeamMemberModal;
