import { Icons } from "@/components/ui/icons";
import PersonAvatar from "@/components/ui/person-avatar";
import useDisclosure from "@/hooks/use-disclosure";
import { QUERYKEYS } from "@/lib/constants";
import { cn, getFormattedText } from "@/lib/utils";
import { ProjectDetails } from "@/types/api.types";
import { Draggable } from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import Heading from "../../../../components/ui/heading";
import ProjectModal from "./project-modal";

interface ProjectCardProps {
  index: number;
  project: ProjectDetails;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryClient = useQueryClient();

  const isLoading = Boolean(
    queryClient.isMutating({
      mutationKey: [QUERYKEYS.UPDATE_PROJECT_MILESTONE, project.id],
    })
  );

  const clientList = project?.form_fields?.find((item) => item.slug === "project_client")
    ?.value as { name: string; email: string }[];

  return (
    <>
      <Draggable key={project.id} draggableId={project.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={onOpen}
            className="mb-2"
          >
            <div
              style={{
                opacity: snapshot.isDragging ? 0.9 : 1,
                transform: snapshot.isDragging ? "rotate(-5deg)" : "",
              }}
              className={cn(
                "bg-white p-2 py-1 transition-all duration-100 rounded-lg flex flex-col overflow-hidden h-48 justify-between !cursor-pointer hover:shadow-md border border-brand-border",
                snapshot.isDragging && "cursor-grabbing shadow-md"
              )}
            >
              <div className="mt-2 flex items-center justify-between">
                <Badge size="sm" variant={project.status}>
                  {getFormattedText(project.status)}
                </Badge>
                {isLoading && (
                  <Icons.spinner className="animate-spin h-4 w-4 text-gray-500" />
                )}
              </div>
              <div>
                <Heading size="h5" className="font-medium leading-[22px]">
                  {project.name} / {project.form_data.client_organization}
                </Heading>
              </div>
              <div className="flex justify-between text-xs space-x-2 mb-1">
                <div className="flex flex-col gap-y-1">
                  <div className="flex -space-x-2">
                    {clientList?.map((item) => (
                      <PersonAvatar key={item.name} name={item.name} email={item.email} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {/* Modal for project details */}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && <ProjectModal isOpen={isOpen} onClose={onClose} project={project} />}
      </AnimatePresence>
    </>
  );
};

export default ProjectCard;
