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
    <div className="flex flex-col min-h-[calc(100vh-320px)] h-full">
      {/* Column header */}
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-gray-600 truncate">
            {column.name}
          </h3>
          <span className="text-[10px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 tabular-nums">
            {columnProjects.length}
          </span>
        </div>
      </div>

      {/* Droppable area */}
      <Droppable
        isDropDisabled={column.id === "disabled"}
        droppableId={column.id}
        type="card"
      >
        {(provided, snapshot) => (
          <div
            className={cn(
              "flex-1 px-2 pb-2 pt-1 transition-colors duration-200 rounded-b-xl",
              snapshot.isDraggingOver && !snapshot.draggingFromThisWith
                ? "bg-blue-50/60 ring-1 ring-inset ring-blue-200"
                : "",
              snapshot.isDraggingOver && column.id === "disabled"
                ? "bg-blue-50/60 ring-1 ring-inset ring-blue-200"
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
