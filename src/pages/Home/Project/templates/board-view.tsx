import { Icons } from "@/components/ui/icons";
import useReorderMilestones from "@/hooks/project-modules/milestones/use-reorder-milestones";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useUpdateProjectMilestone from "@/hooks/project-modules/use-update-project-milestone";
import {
  cn,
  generateBoardMilestone,
  updateProjectMilestoneById,
  updateProjectsIndex,
} from "@/lib/utils";
import { useOrgProjectContext } from "@/pages/Home/Project/context/org-project-context";
import { ProjectDetails } from "@/types/api.types";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import React, { useEffect } from "react";
import ProjectColumn from "../components/project-column";

interface BoardViewProps {
  projects: ProjectDetails[];
  projectTypes: ReturnType<typeof useGetAllProjectTypes>;
  isLoading: boolean;
}

const initialState = {
  projectId: "",
  milestoneId: "",
};

const BoardView: React.FC<BoardViewProps> = ({ projects, projectTypes, isLoading }) => {
  const [milestoneProjects, setMilestoneProjects] = React.useState(projects);
  const { activeProjectType } = useOrgProjectContext();
  const [updateData, setUpdateData] = React.useState(initialState);
  const [milestones, setMilestones] = React.useState(
    generateBoardMilestone(projectTypes?.value?.data, activeProjectType as string)
  );
  const lastReorderedIdsRef = React.useRef<string | null>(null);
  const [reorderingMilestoneId, setReorderingMilestoneId] = React.useState<string | null>(
    null
  );

  const updateProjectMilestone = useUpdateProjectMilestone(updateData.projectId);
  const reorderMilestones = useReorderMilestones(activeProjectType as string);

  useEffect(() => {
    // Don't sync milestones if we're currently reordering
    if (reorderMilestones.isPending || projectTypes.isFetching || projectTypes.isPending)
      return;
    if (!isLoading && projectTypes?.value?.data && activeProjectType) {
      const newMilestones = generateBoardMilestone(
        projectTypes.value.data,
        activeProjectType as string
      );
      const newIds = newMilestones.map((m) => m.id).join(",");

      // If we just reordered and the incoming data matches our reordered order, keep our optimistic update
      if (lastReorderedIdsRef.current === newIds) {
        // The server data matches what we optimistically set, so we can clear the ref
        lastReorderedIdsRef.current = null;
        return;
      }

      // Only update if the order actually changed
      const currentIds = milestones.map((m) => m.id).join(",");
      if (currentIds !== newIds) {
        setMilestones(newMilestones);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, projectTypes, activeProjectType, reorderMilestones.isPending]);

  useEffect(() => {
    if (updateData.projectId && updateData.milestoneId) {
      updateProjectMilestone
        .mutateAsync({
          milestone_id: updateData.milestoneId,
        })
        .then(() => {
          setUpdateData(initialState);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData]);

  const onDragEnd = (result: {
    destination: { droppableId: string; index: number } | null;
    source: { droppableId: string; index: number };
    draggableId: string;
    type: string;
  }) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    // Handle milestone column reordering
    // Check if draggableId starts with "milestone-" or if type is "milestone"
    if (draggableId.startsWith("milestone-") || type === "milestone") {
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const newMilestones = Array.from(milestones);
      const [reorderedMilestone] = newMilestones.splice(source.index, 1);
      newMilestones.splice(destination.index, 0, reorderedMilestone);

      // Optimistically update the UI
      setMilestones(newMilestones);
      // Track which milestone is being reordered to show spinner (use the milestone ID)
      setReorderingMilestoneId(reorderedMilestone.id);

      // Store the reordered IDs so we can check if server data matches
      const milestoneIds = newMilestones.map((milestone) => milestone.id);
      const reorderedIdsString = milestoneIds.join(",");
      lastReorderedIdsRef.current = reorderedIdsString;

      // Call API to reorder milestones
      reorderMilestones.mutateAsync(
        { milestone_ids: milestoneIds },
        {
          onError: (error) => {
            console.error(error);
            lastReorderedIdsRef.current = null;
            setReorderingMilestoneId(null);
            // Revert the optimistic update on error
            if (projectTypes?.value?.data && activeProjectType) {
              const originalMilestones = generateBoardMilestone(
                projectTypes.value.data,
                activeProjectType as string
              );
              setMilestones(originalMilestones);
            }
          },
          onSuccess: () => {
            // Clear the ref after successful reorder
            // The query will refetch and we'll check if it matches
            setTimeout(() => {
              lastReorderedIdsRef.current = null;
              setReorderingMilestoneId(null);
            }, 100);
          },
        }
      );
      return;
    }

    // Handle project card dragging (existing logic)
    // if the drop column is equal to the drag column and the index(position is still the same)
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index != source.index
    ) {
      setMilestoneProjects((prev) => {
        return updateProjectsIndex(prev, draggableId, destination.index);
      });
      return;
    }

    // Moving from one list to another
    setMilestoneProjects((prev) => {
      return updateProjectMilestoneById(prev, draggableId, destination.droppableId);
    });
    setUpdateData({
      projectId: draggableId,
      milestoneId: destination.droppableId,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="milestones-container"
        type="milestone"
        direction="horizontal"
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex overflow-x-auto pb-3 space-x-3 animate-in fade-in-0 duration-700 ease-in-out"
          >
            {milestones.map((milestone, index) => {
              const isReordering =
                reorderingMilestoneId === milestone.id && reorderMilestones.isPending;
              return (
                <Draggable
                  key={milestone.id}
                  draggableId={`milestone-${milestone.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "flex flex-col border border-brand-border bg-brand-table rounded-lg w-52 flex-shrink-0 relative",
                        snapshot.isDragging && "opacity-50 shadow-lg"
                      )}
                    >
                      {isReordering && (
                        <div className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-md">
                          <Icons.spinner className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      )}
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <ProjectColumn column={milestone} projects={milestoneProjects} />
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BoardView;
