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
      <Table>
        <TableHeader className="border bg-white">
          <TableRow className="hover:bg-transparent ">
            <TableHead className="text-gray-500 font-normal">Name</TableHead>
            <TableHead className="text-gray-500 font-normal">No of project</TableHead>
            <TableHead className="text-gray-500 font-normal">Active project</TableHead>
            <TableHead className="text-gray-500 font-normal">
              Av. completion (days)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pipelines.map((pipeline) => (
            <TableRow
              key={pipeline.id}
              className="hover:bg-gray-30 border-b border-[#0000001A]"
            >
              <TableCell className="py-4 ">{pipeline.name}</TableCell>
              <TableCell>{pipeline.noOfProject}</TableCell>
              <TableCell>{pipeline.activeProject}</TableCell>
              <TableCell>{pipeline.avCompletionDays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </div>
      </div> */}
    </div>
  );
};

export default TopPipeline;
