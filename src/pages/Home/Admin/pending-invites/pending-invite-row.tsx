import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { toast } from "sonner";
import { useApproveInvite, useRejectInvite } from "./use-pending-invites";

interface PendingInviteRowProps {
  invite: any;
}

const PendingInviteRow: React.FC<PendingInviteRowProps> = ({ invite }) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const approveMutation = useApproveInvite();
  const rejectMutation = useRejectInvite();

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(invite.id);
      toast.success("Invite approved successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to approve invite");
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync(invite.id);
      toast.success("Invite rejected successfully");
      setShowRejectDialog(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reject invite");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          {invite.contact?.name || "N/A"}
        </TableCell>
        <TableCell>{invite.contact?.email || "N/A"}</TableCell>
        <TableCell>{invite.inviter?.name || "N/A"}</TableCell>
        <TableCell>{formatDate(invite.created_at)}</TableCell>
        <TableCell className="max-w-xs truncate">
          {invite.custom_message || "-"}
        </TableCell>
        <TableCell className="text-right space-x-2">
          <Button
            size="sm"
            variant="default"
            leftIcon={<IoCheckmarkCircle className="w-4 h-4" />}
            onClick={handleApprove}
            disabled={approveMutation.isPending}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            leftIcon={<IoCloseCircle className="w-4 h-4" />}
            onClick={() => setShowRejectDialog(true)}
            disabled={rejectMutation.isPending}
          >
            Reject
          </Button>
        </TableCell>
      </TableRow>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Invite Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this invite request for{" "}
              <strong>{invite.contact?.name}</strong>? The consultant will be
              notified of the rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject}>
              Reject Invite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PendingInviteRow;
