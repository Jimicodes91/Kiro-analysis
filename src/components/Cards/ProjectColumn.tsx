import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import ProjectCard from "./ProjectCard";

interface ProjectColumnProps {
  column: {
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
  };
}

const ProjectColumn: React.FC<ProjectColumnProps> = ({ column }) => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center mb-2 border h-[38px] rounded-md bg-[#0923270D]">
        <h3 className="font-bold">{column.title}</h3>
      </div>
      <Droppable droppableId={column.id} type="card">
        {(provided, snapshot) => (
          <div
            className={`flex-1 min-h-40 ${snapshot.isDraggingOver ? "bg-white" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.cards.map((card, index) => (
              <ProjectCard key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ProjectColumn;
