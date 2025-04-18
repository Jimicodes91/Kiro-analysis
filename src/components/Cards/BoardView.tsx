import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import ProjectEmptyStateCard from "@/pages/projects/components/project-empty-state-card";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import React from "react";
import Loader from "../ui/loader";
import ProjectColumn from "./ProjectColumn";

interface BoardViewProps {
  columns: Record<
    string,
    {
      id: string;
      title: string;
      cards: Array<{
        id: number;
        title: string;
        organization: string;
        status: string;
        clientTeam?: string[];
        projectTeam?: string[];
      }>;
    }
  >;
  columnOrder: string[];
  onDragEnd: (result: {
    destination: { droppableId: string; index: number } | null;
    source: { droppableId: string; index: number };
    draggableId: string;
  }) => void;
  projectData: ReturnType<typeof useGetAllProjects>;
}

const BoardView: React.FC<BoardViewProps> = ({
  columns,
  columnOrder,
  onDragEnd,
  projectData,
}) => {
  const renderBody = () => {
    if (projectData.isLoading) return <Loader />;

    if (!projectData.isLoading && projectData?.value) {
      if (projectData?.value?.data?.length === 0) {
        return <ProjectEmptyStateCard />;
      } else {
        return (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => (
                <div
                  className="flex overflow-x-auto pb-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {columnOrder.map((columnId, index) => {
                    const column = columns[columnId];
                    return (
                      <Draggable key={column.id} draggableId={column.id} index={index}>
                        {(provided) => (
                          <div
                            className="flex flex-col bg-brand-table rounded-lg p-3 mr-4 w-64 flex-shrink-0"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ProjectColumn column={column} />
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
      }
    }

    return <p>Some thing went wrong</p>;
  };

  return <>{renderBody()}</>;
};

export default BoardView;
