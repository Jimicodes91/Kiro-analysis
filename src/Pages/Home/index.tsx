import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Search from "../../Components/Form/search";
import { FormSelect } from "../../Components/Form/select";
import { MainButton } from "../../Components/Form/button";
import { IoAdd, IoSettingsOutline } from "react-icons/io5";
import { GoShare } from "react-icons/go";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
          {" "}
          <div className="flex border-[1px] border-gray-200 items-center px-3 rounded-full">
            <button
              className={`my-2 py-1 px-4 font-medium text-sm ${
                activeTab === "board"
                  ? "text-white border-b-2 bg-primary rounded-full"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("board")}
            >
              Board View
            </button>
            <button
              className={`my-2 py-1 px-4 font-medium text-sm ${
                activeTab === "table"
                  ? "text-white border-b-2 bg-primary rounded-full"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("table")}
            >
              Table View
            </button>
          </div>
          <div className="flex justify-between space-x-2">
            <FormSelect
              //   label="All Project"
              options={[{ value: "all", label: "All project" }]}
            />
            <button
              className="mr-5 cursor-pointer relative border-2 border-[#0000001A] bg-[#0923270F] p-2 rounded-full  "
              type="button"
            >
              <HiOutlineAdjustmentsVertical className="text-[#111] w-6 h-6" />
            </button>
            <button
              className="mr-5 cursor-pointer relative border-2 border-[#0000001A] bg-[#0923270F]  p-2 rounded-full
                                    "
              type="button"
            >
              <GoShare className="text-[#111] w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          {activeTab === "board" ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    className="flex overflow-x-auto pb-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {columnOrder.map((columnId, index) => {
                      const column = columns[columnId];
                      return (
                        <Draggable
                          key={column.id}
                          draggableId={column.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="flex flex-col bg-[#F7F7F7] rounded-lg p-3 mr-4 w-64 flex-shrink-0"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <div
                                className="flex justify-center items-center mb-2 border h-[38px] rounded-md  bg-[#0923270D]"
                                {...provided.dragHandleProps}
                              >
                                <h3 className="font-bold ">{column.title}</h3>
                              </div>
                              <Droppable droppableId={column.id} type="card">
                                {(provided, snapshot) => (
                                  <div
                                    className={`flex-1 min-h-40 ${
                                      snapshot.isDraggingOver ? "bg-white" : ""
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                  >
                                    {column.cards.map((card, index) => (
                                      <Draggable
                                        key={card.id}
                                        draggableId={card.id.toString()}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <div
                                            className="bg-white p-3 rounded shadow mb-2 flex flex-col h-52 justify-between"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <div className="mt-2">
                                              <span
                                                className={`p-1 px-3 inline-flex text-xs leading-5 mb-2 font-semibold rounded-full 
                                                  ${
                                                    card.status === "Completed"
                                                      ? "bg-green-100 text-green-800"
                                                      : card.status ===
                                                        "In progress"
                                                      ? "bg-[#F1E6D4] text-[#B78026]"
                                                      : "bg-[#FB002B1A] text-[#FB002B]"
                                                  }`}
                                              >
                                                {card.status}
                                              </span>
                                            </div>
                                            <div className="font-semibold text-lg mb-1">
                                              {card.title}
                                            </div>
                                            <div className="text-sm text-gray-500 mb-1">
                                              {card.organization}
                                            </div>
                                            <div className="flex justify-between text-xs space-x-2 mb-1">
                                              <div className="flex flex-col ">
                                                <p>Client team</p>
                                                <div className="flex -space-x-2">
                                                  {card.clientTeam?.map(
                                                    (member, index) => (
                                                      <div
                                                        key={index}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
                                                      >
                                                        {member.substring(0, 2)}
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                              <div className="flex justify-between text-xs mb-1">
                                                <div className="flex flex-col ">
                                                  <p> Project team </p>
                                                  <div className="flex -space-x-2">
                                                    {card.clientTeam?.map(
                                                      (member, index) => (
                                                        <div
                                                          key={index}
                                                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
                                                        >
                                                          {member.substring(
                                                            0,
                                                            2
                                                          )}
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
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
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                  <tr className="bg-[#EAECEC] py-1 rounded-md">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected end date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <IoSettingsOutline />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row) => (
                    <tr key={row.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.organization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.completedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`p-2 inline-flex text-sm leading-5 font-semibold rounded-full 
                        ${
                          row.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : row.status === "In progress"
                            ? "bg-[#F1E6D4] text-[#B78026]"
                            : "bg-[#FB002B1A] text-[#FB002B]"
                        }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex -space-x-2">
                          {row.projectTeam?.map((member, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
                            >
                              {member.substring(0, 2)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex -space-x-2">
                          {row.clientTeam?.map((member, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
                            >
                              {member.substring(0, 2)}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
