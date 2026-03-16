import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React from "react";
import PendingInviteRow from "./pending-invite-row";
import PendingInvitesEmptyState from "./pending-invites-empty-state";
import { usePendingInvites } from "./use-pending-invites";

const PendingInvitesTable: React.FC = () => {
  const { data, isLoading } = usePendingInvites();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  const invites = data?.data?.data || [];

  if (invites.length === 0) {
    return <PendingInvitesEmptyState />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact Name</TableHead>
            <TableHead>Contact Email</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Requested Date</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((invite: any) => (
            <PendingInviteRow key={invite.id} invite={invite} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingInvitesTable;
