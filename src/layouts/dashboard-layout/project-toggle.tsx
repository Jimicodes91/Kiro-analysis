import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Heading from "@/components/ui/heading";
import useGetClientProjects from "@/hooks/project-modules/use-get-client-projects";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import { ChevronDown } from "lucide-react";

export default function ProjectToggle() {
  const user = getUserSession();
  const { activeProject, changeActiveProject } = useClientProjectContext();

  const allProjects = useGetClientProjects(user?.id ?? "");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {allProjects?.isPending ? (
            <div className="h-8 min-w-[200px] bg-slate-300 animate-pulse"></div>
          ) : (
            <Heading size="h3" className="capitalize flex items-center gap-2">
              {activeProject ? activeProject?.name : "Select Project"}{" "}
              <ChevronDown className="inline-block size-6 text-primary" />
            </Heading>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60 rounded-lg"
          side={"bottom"}
          sideOffset={16}
          alignOffset={-10}
          align={"start"}
        >
          {allProjects?.value?.data?.map((project) => (
            <DropdownMenuItem
              key={project.id}
              className="text-sm font-medium"
              onClick={() => changeActiveProject(project)}
            >
              <span>{project.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
