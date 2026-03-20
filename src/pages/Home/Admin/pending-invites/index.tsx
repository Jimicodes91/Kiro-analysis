import Heading from "@/components/ui/heading";
import React from "react";
import PendingInvitesTable from "./pending-invites-table";

const PendingInvites: React.FC = () => {
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Heading size="h3">Pending Client Invites</Heading>
      </div>

      <PendingInvitesTable />
    </div>
  );
};

export default PendingInvites;
