import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useDisclosure from "@/hooks/use-disclosure";
import getInitials from "@/lib/utils";
import { Member } from "@/types/api.types";
import { AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import RemoveTeamMemberModal from "../modal/remove-team-member-modal";

type TeamMemberCardProps = {
  member: Member;
  projectId: string;
};

export default function TeamMemberCard({ member, projectId }: TeamMemberCardProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <div className="px-5 py-3 mb-2 space-y-2 rounded-lg border flex justify-between gap-x-4 items-center border-brand-border bg-[#F8F8F8]">
        <div className="flex gap-2 items-center">
          <Avatar className="h-12 w-12">
            <AvatarImage src={"/"} alt="@shadcn" />
            <AvatarFallback className="bg-[#E4E6E7] text-xl text-primary">
              {getInitials(member?.user?.name ?? member?.user?.email)}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm">{member?.user?.name}</p>
        </div>

        <p className="text-sm text-brand-fade p-0 m-0">{member?.user?.email}</p>
        <Button size="icon" variant="ghost" onClick={onOpen}>
          <Trash2 />
        </Button>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <RemoveTeamMemberModal
            projectId={projectId}
            member={member}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}
