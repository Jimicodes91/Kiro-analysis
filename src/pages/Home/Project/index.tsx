import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import ProjectEmptyState from "@/pages/projects/components/project-empty-state";
import React, { useState } from "react";
import { GoShare } from "react-icons/go";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import BoardView from "../../../components/Cards/BoardView";
import TableView from "../../../components/Cards/TableView";
import ViewToggle from "../../../components/Cards/ViewToggle";
import { useProjectContext } from "./project-context";
import ActiveProjectTypeProjectWrapper from "./selected-project-wrapper";

const Project: React.FC = () => {
  const [activeTab, setActiveTab] = useState("board");
  const { activeProjectType } = useProjectContext();
  const allProjects = useGetAllProjects(activeProjectType);
  const projeectTypes = useGetAllProjectTypes();

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
    {
      id: 4,
      title: "Dubai Registration",
      organization: "Orizon Digital",
      startDate: "02 Nov 2023 ",
      dueDate: "02 Nov 2023 ",
      completedDate: "02 Nov 2023 ",
      status: "Completed",
      projectTeam: ["New Horizon", "Orizon Digital", "Stellar Solutions Inc."],
      clientTeam: ["Orizon Digital", "Orizon Digital", "Orizon Digital"],
    },
  ];

  const [columns, setColumns] = useState<
    Record<string, { id: string; title: string; cards: typeof tableData }>
  >({
    "column-1": {
      id: "column-1",
      title: "Onboarding",
      cards: [tableData[0]],
    },
    "column-2": {
      id: "column-2",
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
      cards: [tableData[3]],
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
    "column-7": {
      id: "column-7",
      title: "Renewal",
      cards: [],
    },
  });

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

  const columnOrder = Object.keys(columns);

  if (!projeectTypes.isPending && !projeectTypes?.value) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (
    !projeectTypes.isPending &&
    !!projeectTypes?.value &&
    projeectTypes?.value?.data?.length === 0
  ) {
    return <ProjectEmptyState />;
  }

  return (
    <ActiveProjectTypeProjectWrapper>
      <>
        <div className="flex justify-between items-center">
          <ViewToggle
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            options={[
              { value: "board", label: "Board" },
              { value: "table", label: "Table" },
            ]}
          />
          <div className="flex justify-between space-x-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<HiOutlineAdjustmentsVertical className="text-[#111] w-6 h-6" />}
            >
              Filter
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<GoShare className="text-[#111] w-6 h-6" />}
            >
              Export
            </Button>
          </div>
        </div>

        <div className="mt-4 grid">
          {activeTab === "board" ? (
            <BoardView
              columns={columns}
              columnOrder={columnOrder}
              onDragEnd={onDragEnd}
            />
          ) : (
            <TableView projectData={allProjects} />
          )}
        </div>
      </>
    </ActiveProjectTypeProjectWrapper>
  );
};

export default Project;
