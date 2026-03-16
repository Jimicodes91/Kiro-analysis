import React from "react";
import { IoMailOutline } from "react-icons/io5";

const PendingInvitesEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <IoMailOutline className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Pending Invites
      </h3>
      <p className="text-sm text-gray-500 max-w-md">
        There are no pending client invite requests at the moment. When
        consultants request to send invites, they will appear here for your
        review.
      </p>
    </div>
  );
};

export default PendingInvitesEmptyState;
