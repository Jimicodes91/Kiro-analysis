import { ProjectDetails } from "@/types/api.types";
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
  projects: ProjectDetails[];
}

const ProjectColumn: React.FC<ProjectColumnProps> = ({ column, projects }) => {
  return (
    <div className="flex flex-col space-y-2 min-h-[calc(100vh-290px)] h-full">
      <div className="px-1.5 pt-1.5">
        <div className="flex justify-center py-3 border border-brand-border items-center rounded-md bg-[#0923270D]">
          <h3 className="font-bold">{column.title}</h3>
        </div>
      </div>
      {/* droppableId="all-columns" direction="horizontal" type="column" */}
      <Droppable droppableId={column.id} type="card">
        {(provided, snapshot) => (
          <div
            className={`flex-1 border-2 p-1.5 border-transparent min-h-40 ${snapshot.isDraggingOver && !snapshot.draggingFromThisWith ? "border-blue-500 rounded-lg bg-blue-500/10" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ProjectColumn;
