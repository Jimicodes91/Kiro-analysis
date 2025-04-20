import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import ProjectEmptyStateCard from "@/pages/projects/components/project-empty-state-card";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
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
    if (projectData.isLoading)
      return (
        <div className="min-h-[calc(100vh-290px)]">
          <Loader />
        </div>
      );

    if (!projectData.isLoading && projectData?.value) {
      if (projectData?.value?.data?.length === 0) {
        return <ProjectEmptyStateCard />;
      } else {
        return (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => (
                <div
                  className="flex overflow-x-auto pb-2 space-x-3"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {columnOrder.map((columnId) => {
                    const column = columns[columnId];
                    return (
                      <div
                        className="flex flex-col border border-brand-border bg-brand-table rounded-lg w-52 flex-shrink-0"
                        ref={provided.innerRef}
                      >
                        <ProjectColumn column={column} />
                      </div>
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
