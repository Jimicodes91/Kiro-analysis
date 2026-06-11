import * as React from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAutoCloseMilestone from "@/hooks/project-modules/projects/use-auto-close-milestone";
import useUpdateProject from "@/hooks/project-modules/use-update-project";
import { ProjectStatus, ProjectStatusOptions } from "@/lib/constants";
import { getFormattedText } from "@/lib/utils";
import { getIsClient } from "@/services/api.service";
import { Pen } from "lucide-react";
import { Badge } from "./badge";

export function ProjectStatusToggler({
  status,
  projectId,
  projectTypeId = "",
}: {
  status: `${ProjectStatus}`;
  projectId: string;
  projectTypeId?: string;
}) {
  const [position, setPosition] = React.useState(status);
  const { triggerAutoClose, isTransitioning } = useAutoCloseMilestone(projectId, projectTypeId);
  const updateProject = useUpdateProject(projectId, {
    onStatusCompleted: triggerAutoClose,
  });
  const isClient = getIsClient();

  const updateProjectStatus = (projectStatus: string) => {
    updateProject
      .mutateAsync({
        status: projectStatus,
      })
      .then((res) => {
        console.log(res);
        setPosition(projectStatus as `${ProjectStatus}`);
      });
  };

  if (isClient) {
    return (
      <Badge className="w-fit cursor-pointer" variant={status}>
        {getFormattedText(position)}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 group/edit">
          <Badge
            className="w-fit cursor-pointer"
            variant={status}
            isLoading={updateProject.isPending || isTransitioning}
          >
            {getFormattedText(position)}
          </Badge>
          <Pen className="ml-2 size-3 group-hover/edit:text-gray-700 text-transparent" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="pl-4">Project Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={updateProjectStatus}>
          {ProjectStatusOptions?.map((pStatus) => (
            <DropdownMenuRadioItem value={pStatus.value} className="capitalize">
              {getFormattedText(pStatus.value)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
