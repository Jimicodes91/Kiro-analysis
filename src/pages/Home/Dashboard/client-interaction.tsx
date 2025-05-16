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

interface ClientInteraction {
  id: string;
  name: string;
  pointOfContact?: string;
  purpose: string;
  date: string;
}

interface ClientInteractionProps {
  clients: ClientInteraction[];
  onViewMore?: () => void;
}

const ClientInteraction: React.FC<ClientInteractionProps> = ({ clients, onViewMore }) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#0000001A] px-4 pb-4 pt-2 flex flex-col h-full">
      <SectionHeader title="Client interaction" onViewMore={onViewMore} />

      {/* <div className="flex-grow overflow-hidden flex flex-col">
      <div className="overflow-auto max-h-80"> */}
      <Table>
        <TableHeader className="border bg-white">
          <TableRow className="hover:bg-transparent ">
            <TableHead className="text-gray-500 font-normal">Client name</TableHead>
            <TableHead className="text-gray-500 font-normal">Point of contact</TableHead>
            <TableHead className="text-gray-500 font-normal">Purpose</TableHead>
            <TableHead className="text-gray-500 font-normal">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="hover:bg-gray-30 border-b border-[#0000001A]"
            >
              <TableCell className="py-4">{client.name}</TableCell>
              <TableCell>{client.pointOfContact}</TableCell>
              <TableCell className="max-w-[60px] truncate">{client.purpose}</TableCell>
              <TableCell>{client.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </div>
      </div> */}
    </div>
  );
};

export default ClientInteraction;
