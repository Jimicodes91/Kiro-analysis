import React from "react";
import { LuUserRound } from "react-icons/lu";

interface ContactInfoProps {
  projectTeam: string[];
  clientTeam: string[];
  owner?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  projectTeam,
  clientTeam,
  owner = "Uchenna Okenwa", // Default value if not provided
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Project Owner
        </h3>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-medium">
            {owner
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{owner}</p>
            <p className="text-xs text-gray-500">Project Owner</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Project Team</h3>
        <div className="space-y-3">
          {projectTeam.map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-medium">
                {member
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{member}</p>
                <p className="text-xs text-gray-500">Team Member</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Client Team</h3>
        <div className="space-y-3">
          {clientTeam.map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <LuUserRound className="w-10 h-10 p-2 text-gray-400 bg-gray-200 rounded-full" />
              <div>
                <p className="text-sm font-medium text-gray-900">{member}</p>
                <p className="text-xs text-gray-500">Client Contact</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
