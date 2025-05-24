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

interface TopPipeline {
  id: string;
  name: string;
  noOfProject: number;
  activeProject: number;
  avCompletionDays: number;
}

interface TopPipelineProps {
  pipelines: TopPipeline[];
  onViewMore?: () => void;
}

const TopPipeline: React.FC<TopPipelineProps> = ({ pipelines, onViewMore }) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#0000001A] px-4 pb-4 pt-2 flex flex-col h-full">
      <SectionHeader title="Top pipeline" onViewMore={onViewMore} />

      {/* <div className="flex-grow overflow-hidden flex flex-col">
      <div className="overflow-auto max-h-80"> */}
      <div className="bg-white rounded-lg border border-[#0000001A] overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="border-b border-#0000001A hover:bg-gray-50">
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                Name
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                No of project
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                Active project
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                Av. completion (days)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pipelines.map((pipeline) => (
              <TableRow
                key={pipeline.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0"
              >
                <TableCell className="py-4 px-4 text-sm text-gray-900 font-medium">
                  {pipeline.name}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-gray-600">
                  {pipeline.noOfProject}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-gray-600">
                  {pipeline.activeProject}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-gray-600">
                  {pipeline.avCompletionDays}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* </div>
      </div> */}
    </div>
  );
};

export default TopPipeline;
