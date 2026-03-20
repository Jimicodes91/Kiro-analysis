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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import PersonAvatar from "@/components/ui/person-avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import useSendInvite from "@/hooks/contacts/use-send-invite";
import useUninviteContact from "@/hooks/contacts/use-uninvite-contact";
import { Contact } from "@/types/contact.types";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import ContactModal from "./contact-modal-form";

function ContactTableRow({ contact }: { contact: Contact }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<"create" | "view" | "edit">("view");
  const [isUninviteDialogOpen, setIsUninviteDialogOpen] = useState(false);
  const sendInvite = useSendInvite(contact.id);
  const uninviteContact = useUninviteContact(contact.id);

  const handleEditClick = () => {
    setCurrentMode("edit");
    setIsModalOpen(true);
  };

  const handleViewClick = () => {
    setCurrentMode("view");
    setIsModalOpen(true);
  };

  const handleSendInvite = () => {
    sendInvite
      .mutateAsync({})
      .then((response) => {
        if (response.requires_approval) {
          toast.success("Invite request sent to admins for approval");
        } else {
          toast.success("Invitation sent successfully!");
        }
      })
      .catch((error) => {
        toast.error(error.message || "Failed to send invite");
      });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "uninvited":
        return <Badge variant="secondary">Uninvited</Badge>;
      case "invited":
        return <Badge variant="outline">Invited</Badge>;
      case "active":
        return <Badge variant="active">Active</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{contact?.name}</TableCell>
        <TableCell className="lowercase">{contact?.email}</TableCell>
        <TableCell>{contact?.phone}</TableCell>
        <TableCell>{getStatusBadge(contact?.status)}</TableCell>
        <TableCell>{contact?.no_of_projects || 0}</TableCell>
        <TableCell>{contact?.active_projects || 0}</TableCell>
        <TableCell>{contact?.closed_projects || 0}</TableCell>
        <TableCell>
          {Array.isArray(contact?.assigned_to) && contact.assigned_to.length > 0 ? (
            <div className="flex -space-x-2">
              {contact.assigned_to.map((assignee) => (
                <PersonAvatar key={assignee.name} name={assignee.name} />
              ))}
            </div>
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {contact.status === "uninvited" && (
              <Button
                variant="outline"
                size="sm"
                className="text-foreground border-foreground/20"
                onClick={handleSendInvite}
                isLoading={sendInvite.isPending}
              >
                Send Invite
              </Button>
            )}
            {contact.status === "active" && (
              <AlertDialog open={isUninviteDialogOpen} onOpenChange={setIsUninviteDialogOpen}>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsUninviteDialogOpen(true)}
                  isLoading={uninviteContact.isPending}
                >
                  Uninvite
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Uninvite Contact</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to uninvite this contact? They will
                      lose access to the platform and will need to be re-invited.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        uninviteContact
                          .mutateAsync({})
                          .then(() => {
                            toast.success("Contact uninvited successfully");
                          })
                          .catch((error) => {
                            toast.error(
                              error?.response?.data?.message ||
                                "Failed to uninvite contact"
                            );
                          });
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Uninvite
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icons.more className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end" forceMount>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleViewClick}>
                    View Contact
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEditClick}>
                    Edit Contact
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isModalOpen && (
          <ContactModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            mode={currentMode}
            contactData={contact}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ContactTableRow;
