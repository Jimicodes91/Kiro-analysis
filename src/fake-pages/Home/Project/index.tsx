import React, { useState } from "react";
import Search from "../../../components/Form/search";
import { FormSelect } from "../../../components/Form/select";
import { MainButton } from "../../../components/Form/button";
import { IoAdd } from "react-icons/io5";
import { GoShare } from "react-icons/go";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import BoardView from "../../../components/Cards/BoardView";
import TableView from "../../../components/Cards/TableView";
import ViewToggle from "../../../components/Cards/ViewToggle";

const Project: React.FC = () => {
  const [, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("board");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search Query:", query);
  };

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

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between ">
        <div className="flex items-center space-x-4  mt-5 md:mt-0">
          <h1 className="text-2xl font-bold mr-5">Project</h1>
          <Search placeholder="Search keyword" onSearch={handleSearch} />
        </div>
        <div className="flex items-center space-x-4 mt-5 md:mt-0">
          <FormSelect
            label=""
            value={"db"}
            options={[
              { value: "Nigeria", label: "Nigeria Registration" },
              { value: "usa", label: "United States Registration" },
              { value: "uk", label: "United Kingdom Registration" },
              { value: "db", label: "Dubai Registration" },
            ]}
          />
          <MainButton>
            <span className="mr-3 text-xl">
              <IoAdd />
            </span>
            Add project
          </MainButton>
        </div>
      </div>
      <div className="border-[1px] border-[#0000001A] rounded-lg mt-4 p-4">
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
            <FormSelect
              value={"all"}
              options={[{ value: "all", label: "All project" }]}
            />
            <button
              className="mr-5 cursor-pointer relative border-2 border-[#0000001A] bg-[#0923270F] p-2 rounded-full"
              type="button"
            >
              <HiOutlineAdjustmentsVertical className="text-[#111] w-6 h-6" />
            </button>
            <button
              className="mr-5 cursor-pointer relative border-2 border-[#0000001A] bg-[#0923270F] p-2 rounded-full"
              type="button"
            >
              <GoShare className="text-[#111] w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          {activeTab === "board" ? (
            <BoardView
              columns={columns}
              columnOrder={columnOrder}
              onDragEnd={onDragEnd}
            />
          ) : (
            <TableView tableData={tableData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;
