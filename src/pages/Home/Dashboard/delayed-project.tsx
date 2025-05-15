import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { SectionHeader } from "./components/section-header";

interface DelayedProject {
  id: string;
  name: string;
  company?: string;
  status: string;
}

interface DelayedProjectProps {
  delayedProjects: DelayedProject[];
  onViewMore?: () => void;
}

const DelayedProject: React.FC<DelayedProjectProps> = ({
  delayedProjects,
  onViewMore,
}) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#0000001A] px-4 pb-4 pt-2 flex flex-col h-full">
      <SectionHeader title="Delayed project" onViewMore={onViewMore} />

      {/* <div className="flex-grow overflow-hidden flex flex-col">
      <div className="overflow-auto max-h-80"> */}
      <Table>
        <TableHeader className="border bg-white">
          <TableRow className="hover:bg-transparent ">
            <TableHead className="text-gray-500 font-normal">Project name</TableHead>
            <TableHead className="text-gray-500 font-normal">Company</TableHead>
            <TableHead className="text-gray-500 font-normal">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {delayedProjects.map((project) => (
            <TableRow
              key={project.id}
              className="hover:bg-gray-30 border-b border-[#0000001A]"
            >
              <TableCell className="py-4 max-w-[60px] truncate">{project.name}</TableCell>
              <TableCell className="max-w-[60px] truncate">{project.company}</TableCell>
              <TableCell>
                <Badge variant={project.status === "overdue" ? "destructive" : "active"}>
                  <span>{project.status}</span>
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </div>
      </div> */}
    </div>
  );
};

export default DelayedProject;
