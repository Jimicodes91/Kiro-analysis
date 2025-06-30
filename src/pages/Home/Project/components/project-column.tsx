import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { cn, getMileStoneProject } from "@/lib/utils";
import { ProjectDetails } from "@/types/api.types";
import { Droppable } from "@hello-pangea/dnd";
import React from "react";
import ProjectCard from "./project-card";

interface ProjectColumnProps {
  column: ProjectTypeMilestone;
  projects: ProjectDetails[];
}

const ProjectColumn: React.FC<ProjectColumnProps> = ({ column, projects }) => {
  const columnProjects = getMileStoneProject(projects, column.id);
  return (
    <div className="flex flex-col space-y-2 min-h-[calc(100vh-290px)] h-full">
      <div className="px-1.5 pt-1.5">
        <div className="flex justify-center gap-2 py-3 border border-brand-border items-center rounded-md bg-[#0923270D]">
          <h3 className="uppercase text-sm font-semibold">{column.name}</h3>
        </div>
      </div>
      <Droppable
        isDropDisabled={column.id === "disabled"}
        droppableId={column.id}
        type="card"
      >
        {(provided, snapshot) => (
          <div
            className={cn(
              "flex-1 border-2 p-1.5 border-transparent min-h-40",
              snapshot.isDraggingOver && !snapshot.draggingFromThisWith
                ? "border-blue-500 rounded-lg bg-blue-500/10"
                : "",
              snapshot.isDraggingOver && column.id === "disabled"
                ? "border-blue-500 rounded-lg bg-blue-500/10"
                : ""
            )}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columnProjects.map((project, index) => (
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
