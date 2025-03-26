import React from "react";
import { Draggable } from "@hello-pangea/dnd";

interface ProjectCardProps {
  card: {
    id: number;
    title: string;
    organization: string;
    status: string;
    clientTeam?: string[];
    projectTeam?: string[];
  };
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ card, index }) => {
  return (
    <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
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
                    : card.status === "In progress"
                    ? "bg-[#F1E6D4] text-[#B78026]"
                    : "bg-[#FB002B1A] text-[#FB002B]"
                }`}
            >
              {card.status}
            </span>
          </div>
          <div className="font-semibold text-lg mb-1">{card.title}</div>
          <div className="text-sm text-gray-500 mb-1">{card.organization}</div>
          <div className="flex justify-between text-xs space-x-2 mb-1">
            <div className="flex flex-col">
              <p>Client team</p>
              <div className="flex -space-x-2">
                {card.clientTeam?.map((member, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
                  >
                    {member.substring(0, 2)}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <div className="flex flex-col">
                <p>Project team</p>
                <div className="flex -space-x-2">
                  {card.projectTeam?.map((member, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
                    >
                      {member.substring(0, 2)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ProjectCard;