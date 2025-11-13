import Modal from "@/components/Modal";
import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAllProjectTypeMilestones, {
  ProjectTypeMilestone,
} from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import useDeleteMilestone from "@/hooks/project-modules/milestones/use-delete-milestone";
import { useState } from "react";

interface DeleteMilestoneModalProps extends ModalProps {
  milestone: ProjectTypeMilestone;
  projectTypeId: string;
  onSuccess?: () => void;
}

const DeleteMilestoneModal = ({
  onClose,
  isOpen,
  milestone,
  projectTypeId,
  onSuccess,
}: DeleteMilestoneModalProps) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("");
  const deleteMilestone = useDeleteMilestone(projectTypeId, milestone.id);
  const { value: milestonesData } = useGetAllProjectTypeMilestones(projectTypeId);

  // Check if milestone has projects
  const hasProjects = milestone.projects && milestone.projects.length > 0;

  // Get available milestones (excluding the one being deleted)
  const availableMilestones =
    milestonesData?.data?.filter((m) => m.id !== milestone.id) || [];

  //   console.log({
  //     milestone,
  //     milestonesData,
  //     availableMilestones,
  //     hasProjects,
  //     selectedMilestoneId,
  //   });

  const closeModal = () => {
    onClose();
    setSelectedMilestoneId("");
  };
  const handleDelete = () => {
    if (hasProjects && !selectedMilestoneId) {
      return; // Don't proceed if projects exist but no target milestone selected
    }

    // TODO: If hasProjects, we might need to move projects first via API
    // For now, assuming the backend handles this when we delete with a target milestone
    // If not, we'll need to create a separate API call to move projects

    deleteMilestone
      .mutateAsync({
        target_milestone_id: selectedMilestoneId,
      })
      .then(() => {
        onSuccess?.();
        closeModal();
      })
      .catch(console.error);
  };

  return (
    <Modal
      title={hasProjects ? "Move Projects Before Deletion" : "Delete Milestone"}
      closeModal={closeModal}
      isOpen={isOpen}
    >
      <div className="p-3 space-y-4">
        {hasProjects ? (
          <>
            <p className="text-gray-500 text-sm">
              The milestone <span className="font-bold">{milestone.name}</span> contains
              one or more projects. Please move them to another milestone before deleting
              this one.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select a milestone to move projects to
              </label>
              <Select value={selectedMilestoneId} onValueChange={setSelectedMilestoneId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {availableMilestones.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-gray-500">
                      No other milestones available
                    </div>
                  ) : (
                    availableMilestones.map((milestone) => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-sm">
            Are you sure you want to delete this milestone? This action cannot be undone.
          </p>
        )}

        <div className="flex gap-3 items-center justify-end pt-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            isLoading={deleteMilestone.isPending}
            onClick={handleDelete}
            disabled={hasProjects && !selectedMilestoneId}
          >
            {hasProjects ? "Move Projects & Delete Milestone" : "Delete Milestone"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteMilestoneModal;
