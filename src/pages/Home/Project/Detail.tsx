import React from "react";

interface DetailProps {
  startDate: string;
  dueDate: string;
  status: string;
  organization: string;
  title: string;
  description?: string;
  client?: string;
  projectTeam?: string[];
}

const Detail: React.FC<DetailProps> = ({ status, organization, client, projectTeam }) => {
  const statusColor = () => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In progress":
        return "bg-[#F1E6D4] text-[#B78026]";
      default:
        return "bg-[#FB002B1A] text-[#FB002B]";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Client</h3>
          <p className="mt-1 text-sm text-gray-900">{client}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Project type</h3>
          <p className="mt-1 text-sm text-gray-900">Client based</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Company</h3>
          <p className="mt-1 text-sm text-gray-900">{organization}</p>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">Status</h3>
        <span
          className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor()}`}
        >
          {status}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
        <p className="mt-1 text-sm text-gray-900">6 months</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Assignee</h3>
        <div className="flex -space-x-2">
          {projectTeam?.map((member, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center mt-2 w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm font-medium ring-2 ring-white"
            >
              {member.substring(0, 2)}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Phase</h3>
        <p className="mt-1 text-sm text-gray-900">Pre travel</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Milestone</h3>
        <p className="mt-1 text-sm text-gray-900">Permit</p>
      </div>

      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Creation date</h3>
          <p className="mt-1 text-sm text-gray-900">02 Nov 2024 1:52 PM</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
          <p className="mt-1 text-sm text-gray-900">02 Nov 2024</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Expected end date</h3>
          <p className="mt-1 text-sm text-gray-900">03 Apr 2025</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Last update </h3>
          <p className="mt-1 text-sm text-gray-900">02 Nov 2024 1:52 PM</p>
        </div>
      </div>
    </div>
  );
};

export default Detail;
