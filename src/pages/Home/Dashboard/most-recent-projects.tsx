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
      <div className="bg-white rounded-lg border border-[#0000001A] overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="border-b border-#0000001A hover:bg-gray-50">
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                Project name
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                Status
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                Expected end date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0"
              >
                <TableCell className="py-4 px-4 text-sm text-gray-900 font-medium">
                  {project.name}
                </TableCell>
                <TableCell className="py-4 px-4">
                  <Badge variant={project.status}>
                    <span>{getFormattedText(project.status)}</span>
                  </Badge>
                </TableCell>
                <TableCell py-4 px-4 text-sm text-gray-600>
                  {project.expectedEndDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    //   </div>
    // </div>
  );
};

export default MostRecentProject;
