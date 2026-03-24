import { Icons } from "@/components/ui/icons";
import PersonAvatar from "@/components/ui/person-avatar";
import { QUERYKEYS } from "@/lib/constants";
import { cn, getFormattedText } from "@/lib/utils";
import { ProjectDetails } from "@/types/api.types";
import { Draggable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";

interface ProjectCardProps {
  index: number;
  project: ProjectDetails;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isLoading = Boolean(
    queryClient.isMutating({
      mutationKey: [QUERYKEYS.UPDATE_PROJECT_MILESTONE, project.id],
    })
  );

  const clientList = project?.form_fields?.find((item) => item.slug === "project_client")
    ?.value as { name: string; email: string }[];

  return (
    <Draggable key={project.id} draggableId={project.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/projects/${project.id}`)}
          className="mb-2"
        >
            <div
              className={cn(
                "bg-white rounded-lg border border-gray-200 p-3 transition-all duration-150",
                "flex flex-col justify-between gap-3 cursor-pointer",
                "hover:shadow-md hover:border-gray-300",
                snapshot.isDragging && "shadow-lg rotate-[-2deg] opacity-90"
              )}
            >
              {/* Top row: status + loading */}
              <div className="flex items-center justify-between">
                <Badge size="sm" variant={project.status}>
                  {getFormattedText(project.status)}
                </Badge>
                {isLoading && (
                  <Icons.spinner className="animate-spin h-3.5 w-3.5 text-gray-400" />
                )}
              </div>

              {/* Project name */}
              <div className="min-h-[40px]">
                <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                  {project.name}
                </p>
              </div>

              {/* Client avatars */}
              {clientList && clientList.length > 0 && (
                <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                  <div className="flex -space-x-1.5">
                    {clientList.slice(0, 4).map((item) => (
                      <PersonAvatar key={item.name} name={item.name} email={item.email} />
                    ))}
                  </div>
                  {clientList.length > 4 && (
                    <span className="text-[10px] text-gray-400 ml-1">
                      +{clientList.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
  );
};

export default ProjectCard;
