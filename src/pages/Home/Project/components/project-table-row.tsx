import PersonAvatar from "@/components/ui/person-avatar";
import { getFormattedText } from "@/lib/utils";
import { ProjectDetails } from "@/types/api.types";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { TableCell, TableRow } from "../../../../components/ui/table";

const ProjectTableRow = ({ project }: { project: ProjectDetails }) => {
  const navigate = useNavigate();

  const clientList = project?.form_fields?.find((item) => item.slug === "project_client")
    ?.value as { name: string; email: string }[];

  return (
      <TableRow
        key={project.id}
        onClick={() => navigate(`/projects/${project.id}`)}
        className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
      >
        <TableCell className="font-medium text-gray-900">{project.name}</TableCell>
        <TableCell className="text-gray-600 tabular-nums">
          {project.start_date ? format(project.start_date, "PPP") : "—"}
        </TableCell>
        <TableCell className="text-gray-600 tabular-nums">
          {project?.end_date ? format(project.end_date, "PPP") : "—"}
        </TableCell>
        <TableCell className="text-gray-600 tabular-nums">
          {project?.completed_at ? format(project.completed_at, "PPP") : "—"}
        </TableCell>
        <TableCell>
          <Badge size="sm" variant={project.status}>
            {getFormattedText(project.status)}
          </Badge>
        </TableCell>
        <TableCell>
          {clientList && clientList.length > 0 ? (
            <div className="flex -space-x-1.5">
              {clientList.slice(0, 3).map((item) => (
                <PersonAvatar key={item.name} name={item.name} email={item.email} />
              ))}
              {clientList.length > 3 && (
                <span className="text-xs text-gray-400 ml-2">
                  +{clientList.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </TableCell>
      </TableRow>
  );
};

export default ProjectTableRow;
