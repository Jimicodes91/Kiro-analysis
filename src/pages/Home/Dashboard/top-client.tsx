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

interface TopClient {
  id: string;
  name: string;
  company: string;
  noOfProject: number;
  activeProject: number;
}

interface TopClientProps {
  clients: TopClient[];
  onViewMore?: () => void;
}

const TopClient: React.FC<TopClientProps> = ({ clients, onViewMore }) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#0000001A] px-4 pb-4 pt-2 flex flex-col h-full">
      <SectionHeader title="Top client" onViewMore={onViewMore} />

      {/* <div className="flex-grow overflow-hidden flex flex-col">
      <div className="overflow-auto max-h-80"> */}
      <Table>
        <TableHeader className="border bg-white">
          <TableRow className="hover:bg-transparent ">
            <TableHead className="text-gray-500 font-normal">Client name</TableHead>
            <TableHead className="text-gray-500 font-normal">Company</TableHead>
            <TableHead className="text-gray-500 font-normal">No of project</TableHead>
            <TableHead className="text-gray-500 font-normal">Active project</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="hover:bg-gray-30 border-b border-[#0000001A]"
            >
              <TableCell className="py-4 max-w-[60px] truncate">{client.name}</TableCell>
              <TableCell className="max-w-[60px] truncate">{client.company}</TableCell>
              <TableCell className="max-w-[60px] truncate">
                {client.noOfProject}
              </TableCell>
              <TableCell>{client.activeProject}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </div>
      </div> */}
    </div>
  );
};

export default TopClient;
