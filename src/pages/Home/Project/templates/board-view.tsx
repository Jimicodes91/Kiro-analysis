import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useUpdateProjectMilestone from "@/hooks/project-modules/use-update-project-milestone";
import { generateBoardMilestone, updateProjectMilestoneById } from "@/lib/utils";
import { useProjectContext } from "@/pages/Home/Project/context/project-context";
import { ProjectDetails } from "@/types/api.types";
import { DragDropContext } from "@hello-pangea/dnd";
import React, { useEffect } from "react";
import ProjectColumn from "../components/project-column";

interface BoardViewProps {
  projects: ProjectDetails[];
  projectTypes: ReturnType<typeof useGetAllProjectTypes>;
}

const initialState = {
  projectId: "",
  milestoneId: "",
};

const BoardView: React.FC<BoardViewProps> = ({ projects, projectTypes }) => {
  const [milestoneProjects, setMilestoneProjects] = React.useState(projects);
  const { activeProjectType } = useProjectContext();
  const [updateData, setUpdateData] = React.useState(initialState);

  const updateProjectMilestone = useUpdateProjectMilestone(updateData.projectId);

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
  }) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // if the drop column is equal to the drag column and the index(position is still the same)
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // if (destination.droppableId === source.droppableId) {
    // mutate asyn function
    // }

    // const start = columns[source.droppableId as string];
    // const finish = columns[destination.droppableId];

    // if (start === finish) {
    //   const newCardIds = Array.from(start.cards);
    //   newCardIds.splice(source.index, 1);
    //   newCardIds.splice(
    //     destination.index,
    //     0,
    //     start.cards.find(
    //       (card) => card.id.toString() === draggableId
    //     ) as (typeof tableData)[0]
    //   );

    //   const newColumn = {
    //     ...start,
    //     cards: newCardIds,
    //   };

    //   setColumns({
    //     ...columns,
    //     [newColumn.id]: newColumn,
    //   });
    //   return;
    // }

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
      <div className="flex overflow-x-auto pb-3 space-x-3 animate-in fade-in-0 duration-700 ease-in-out">
        {generateBoardMilestone(
          projectTypes?.value?.data,
          activeProjectType as string
        ).map((milestone) => {
          return (
            <div
              key={milestone.id}
              className="flex flex-col border border-brand-border bg-brand-table rounded-lg w-52 flex-shrink-0"
            >
              <ProjectColumn column={milestone} projects={milestoneProjects} />
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default BoardView;
