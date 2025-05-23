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
      <div className="bg-white rounded-lg border border-[#0000001A] overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="border-b border-#0000001A hover:bg-gray-50">
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                Client name
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                Company
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                No of project
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-medium text-gray-700 text-sm h-auto">
                Active project
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0"
              >
                <TableCell className="py-4 px-4 text-sm text-gray-900 font-medium max-w-[60px] truncate">
                  {client.name}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-gray-600 max-w-[60px] truncate">
                  {client.company}
                </TableCell>
                <TableCell className="py-4 px-4 text-sm text-gray-600 max-w-[60px] truncate">
                  {client.noOfProject}
                </TableCell>
                <TableCell py-4 px-4 text-sm text-gray-600>
                  {client.activeProject}
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

export default TopClient;
