import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import { SectionHeader } from "./components/section-header";

interface ProjectDetails {
  id: string;
  name: string;
  company: string;
  status: "in progress" | "completed" | "overdue";
  startDate: string;
  milestone: string;
  progress: number;
}

interface ProjectStatusTableProps {
  projects?: ProjectDetails[];
  isLoading?: boolean;
  isError?: boolean;
}

const ProjectTableRow = ({ project }: { project: ProjectDetails }) => {
  return (
    <TableRow>
      <TableCell>{project.name}</TableCell>
      <TableCell>{project.company}</TableCell>
      <TableCell>
        <Badge
          variant={
            project.status === "in progress"
              ? "in_progress"
              : project.status === "completed"
                ? "success"
                : "destructive"
          }
        >
          <span>{project.status}</span>
        </Badge>
      </TableCell>
      <TableCell>{project.startDate}</TableCell>
      <TableCell>{project.milestone}</TableCell>
      <TableCell>
        <div className="w-full bg-gray-200 rounded-full h-5">
          <div
            className="bg-slate-900 h-5 rounded-full relative flex items-center justify-center"
            style={{ width: `${project.progress}%` }}
          >
            <span className="text-xs font-medium text-white">{project.progress}%</span>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

const ProjectStatus: React.FC<ProjectStatusTableProps> = ({
  projects = [],
  isLoading = false,
  isError = false,
}) => {
  const renderTableBody = () => {
    if (isLoading) return <TableSkeletonRowLoader length={6} />;

    if (isError) return <EmptyTable message="Something went wrong" length={6} />;

    if (projects.length === 0)
      return <EmptyTable message="No projects found" length={6} />;

    return (
      <TableBody className="text-xs">
        <TableRow className="border-0 outline-none !bg-transparent">
          <TableCell className="border-0 h-3 py-0" colSpan={6}></TableCell>
        </TableRow>
        <>
          {projects.map((project) => (
            <ProjectTableRow key={project.id} project={project} />
          ))}
        </>
      </TableBody>
    );
  };

  return (
    <div className="bg-[#F4F4F4] rounded-[6px] border border-[#0000001A] px-4 pb-4 pt-2">
      <SectionHeader title="Project status" />
      <div className="grid grid-cols-12 w-full">
        <div className="bg-brand-table col-span-12 rounded-lg p-1">
          <Table className="overflow-auto">
            <TableHeader>
              <TableRow className="hover:bg-[#EAECEC] border">
                <TableHead>Project name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start date</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            {renderTableBody()}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
