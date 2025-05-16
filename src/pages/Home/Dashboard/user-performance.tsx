import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getInitials from "@/lib/utils";
import React from "react";
import { SectionHeader } from "./components/section-header";

interface UserPerformance {
  id: string;
  name: string;
  avatar?: string;
  completedTasks: number;
  callsMade: number;
  tasksClosed: number;
}

interface UserPerformanceCardProps {
  users: UserPerformance[];
  onViewMore?: () => void;
}

const UserPerformance: React.FC<UserPerformanceCardProps> = ({ users, onViewMore }) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#0000001A] px-4 pb-4 pt-2 flex flex-col h-full">
      <SectionHeader title="User performance" onViewMore={onViewMore} />

      {/* <div className="flex-grow overflow-hidden flex flex-col">
      <div className="overflow-auto max-h-80"> */}
      <Table>
        <TableHeader className="border bg-white">
          <TableRow className="hover:bg-transparent ">
            <TableHead className="text-gray-500 font-normal">Team member</TableHead>
            <TableHead className="text-gray-500 font-normal">Completed task</TableHead>
            <TableHead className="text-gray-500 font-normal">Calls made</TableHead>
            <TableHead className="text-gray-500 font-normal">Task closed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="hover:bg-gray-30 border-b border-[#0000001A]"
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs bg-gray-200">
                      {getInitials(user.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.completedTasks}</TableCell>
              <TableCell>{user.callsMade}</TableCell>
              <TableCell>{user.tasksClosed}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </div>
      </div> */}
    </div>
  );
};

export default UserPerformance;
