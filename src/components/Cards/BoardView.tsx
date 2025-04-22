import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import { useProjectContext } from "@/pages/Home/Project/project-context";
import ProjectEmptyStateCard from "@/pages/projects/components/project-empty-state-card";
import { DragDropContext } from "@hello-pangea/dnd";
import React from "react";
import Loader from "../ui/loader";
import ProjectColumn from "./ProjectColumn";

interface BoardViewProps {
  projectData: ReturnType<typeof useGetAllProjects>;
}

const BoardView: React.FC<BoardViewProps> = ({ projectData }) => {
  const { activeProjectType } = useProjectContext();
  const tableData = [
    {
      id: 1,
      title: "Nigeria Registration",
      organization: "Orizon Digital",
      startDate: "02 Nov 2023 ",
      dueDate: "02 Nov 2023 ",
      completedDate: "02 Nov 2023 ",
      status: "Completed",
      projectTeam: ["Orizon Digital", "Orizon Digital", "Orizon Digital"],
      clientTeam: ["Orizon Digital", "Orizon Digital", "Orizon Digital"],
    },
    {
      id: 2,
      title: "ElevatePro Digital Transformation",
      organization: "Stellar Solutions Inc.",
      startDate: "02 Nov 2023 ",
      dueDate: "02 Nov 2023 ",
      completedDate: "02 Nov 2023 ",
      status: "In progress",
      projectTeam: ["Orizon Digital", "Orizon Digital", "Orizon Digital"],
      clientTeam: ["Orizon Digital", "Orizon Digital", "Orizon Digital"],
    },
    {
      id: 3,
      title: "United States Registration",
      organization: "Orizon Digital",
      startDate: "02 Nov 2023 ",
      dueDate: "02 Nov 2023 ",
      completedDate: "02 Nov 2023 ",
      status: "Not started",
      projectTeam: ["Orizon Digital", "Orizon Digital", "Orizon Digital"],
      clientTeam: ["Orizon Digital", "Orizon Digital", "Orizon Digital"],
    },
  ];

  const [columns, setColumns] = React.useState<
    Record<string, { id: string; title: string; cards: typeof tableData }>
  >({
    "column-1": {
      id: "7a5b91c9-ce8b-4364-98e3-9df109369056",
      title: "Onboarding",
      cards: [tableData[0]],
    },
    "column-2": {
      id: "4ade5ecd-e84d-49fa-8ee6-43c79cf3e0d3",
      title: "Licensing",
      cards: [tableData[1]],
    },
    "column-3": {
      id: "column-3",
      title: "Permit",
      cards: [tableData[2]],
    },
    "column-4": {
      id: "column-4",
      title: "Travel",
      cards: [],
    },
    "column-5": {
      id: "column-5",
      title: "Immigration",
      cards: [],
    },
    "column-6": {
      id: "column-6",
      title: "Banking",
      cards: [],
    },
  });

  const columnOrder = Object.keys(columns);

  const onDragEnd = (result: {
    destination: { droppableId: string; index: number } | null;
    source: { droppableId: string; index: number };
    draggableId: string;
  }) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId as string];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newCardIds = Array.from(start.cards);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(
        destination.index,
        0,
        start.cards.find(
          (card) => card.id.toString() === draggableId
        ) as (typeof tableData)[0]
      );

      const newColumn = {
        ...start,
        cards: newCardIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving from one list to another
    const startCardIds = Array.from(start.cards);
    const movedCard = start.cards.find(
      (card) => card.id.toString() === draggableId
    ) as (typeof tableData)[0];
    startCardIds.splice(source.index, 1);
    const newStart = {
      ...start,
      cards: startCardIds,
    };

    const finishCardIds = Array.from(finish.cards);
    finishCardIds.splice(destination.index, 0, movedCard);
    const newFinish = {
      ...finish,
      cards: finishCardIds,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  };

  const renderBody = () => {
    if (projectData.isLoading || !activeProjectType)
      return (
        <div className="min-h-[calc(100vh-290px)]">
          <Loader />
        </div>
      );

    if (!projectData.isLoading && projectData?.value) {
      if (projectData?.value?.data?.length === 0) {
        return <ProjectEmptyStateCard />;
      } else {
        const projects = projectData.value.data ?? [];
        return (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto pb-3 space-x-3">
              {columnOrder.map((columnId) => {
                const column = columns[columnId];
                return (
                  <div className="flex flex-col border border-brand-border bg-brand-table rounded-lg w-52 flex-shrink-0">
                    <ProjectColumn
                      column={column}
                      // projects={projects?.filter((project) => project.id === column.id)}
                      projects={projects}
                    />
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        );
      }
    }

    return <p>Some thing went wrong</p>;
  };

  return <>{renderBody()}</>;
};

export default BoardView;
