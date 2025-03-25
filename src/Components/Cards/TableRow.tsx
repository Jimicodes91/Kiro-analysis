import React from "react";
import { TableRowProps } from "../../types";

const TableRow: React.FC<TableRowProps> = ({ row }) => {
  return (
    <tr key={row.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {row.title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {row.organization}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {row.startDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {row.dueDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {row.completedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`p-2 inline-flex text-sm leading-5 font-semibold rounded-full 
          ${
            row.status === "Completed"
              ? "bg-green-100 text-green-800"
              : row.status === "In progress"
              ? "bg-[#F1E6D4] text-[#B78026]"
              : "bg-[#FB002B1A] text-[#FB002B]"
          }`}
        >
          {row.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex -space-x-2">
          {row.projectTeam?.map((member, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
            >
              {member.substring(0, 2)}
            </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex -space-x-2">
          {row.clientTeam?.map((member, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
            >
              {member.substring(0, 2)}
            </div>
          ))}
        </div>
      </td>

    </tr>
  );
};

export default TableRow;