// tablerow.tsx
import useDisclosure from "@/hooks/use-disclosure";
import getInitials, { getFormattedText } from "@/lib/utils";
import { ProjectDetails } from "@/types/api.types";
import { format } from "date-fns";
import { Badge } from "../../../../components/ui/badge";
import { TableCell, TableRow } from "../../../../components/ui/table";
import ProjectModal from "./project-modal";

const ProjectTableRow = ({ project }: { project: ProjectDetails }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <TableRow
        key={project.id}
        onClick={onOpen}
        className="cursor-pointer hover:bg-gray-50"
      >
        <TableCell className="">{project.name}</TableCell>
        <TableCell>{project.form_data.client_organization}</TableCell>
        <TableCell>{format(project.start_date, "PPP")}</TableCell>
        <TableCell>{format(project.end_date, "PPP")}</TableCell>
        <TableCell>Nill</TableCell>
        <TableCell>
          <Badge size="sm" variant={project.status}>
            {getFormattedText(project.status)}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex -space-x-2">
            {["Johnbosco", "Segun", "Nicholas"]?.map((member, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F1F1F1] text-dark text-xs font-medium ring-2 ring-white"
              >
                {getInitials(member)}
              </div>
            ))}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex -space-x-2">
            {["Johnbosco", "Segun", "Nicholas"]?.map((member, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F1F1F1] text-dark text-xs font-medium ring-2 ring-white"
              >
                {getInitials(member)}
              </div>
            ))}
          </div>
        </TableCell>
      </TableRow>

      {/* Modal for project details - same as in ProjectCard */}
      {isOpen && <ProjectModal onClose={onClose} isOpen={isOpen} project={project} />}
    </>
  );
};

export default ProjectTableRow;
