import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFormattedText } from "@/lib/utils";
import React from "react";
import { SectionHeader } from "./components/section-header";

interface MostRecentProject {
  id: string;
  name: string;
  company: string;
  status: "not_started" | "pending" | "in_progress" | "completed";
  expectedEndDate: string;
}

interface MostRecentProjectCardProps {
  projects: MostRecentProject[];
}

const MostRecentProject: React.FC<MostRecentProjectCardProps> = ({ projects }) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#0000001A] px-4 pb-4 pt-2 flex flex-col h-full">
      <SectionHeader title="Most recent project" className="mt-2 mb-3" />

      {/* <div className="flex-grow overflow-hidden flex flex-col">
        <div className="overflow-auto max-h-80"> */}
      <Table>
        <TableHeader className="border bg-white">
          <TableRow className="hover:bg-transparent ">
            <TableHead className="text-gray-500 font-normal">Project name</TableHead>
            <TableHead className="text-gray-500 font-normal">Company</TableHead>
            <TableHead className="text-gray-500 font-normal">Status</TableHead>
            <TableHead className="text-gray-500 font-normal">Expected end date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className="hover:bg-gray-30 border-b border-[#0000001A]"
            >
              <TableCell className="py-4">{project.name}</TableCell>
              <TableCell>{project.company}</TableCell>
              <TableCell>
                <Badge variant={project.status}>
                  <span>{getFormattedText(project.status)}</span>
                </Badge>
              </TableCell>
              <TableCell>{project.expectedEndDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    //   </div>
    // </div>
  );
};

export default MostRecentProject;
