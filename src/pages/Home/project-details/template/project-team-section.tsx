import { Button } from "@/components/ui/button";
import ViewToggle from "@/components/ui/view-toggle";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import React from "react";
import TeamMemberCard from "../components/cards/team-member-card";
import AddTeamModal from "../components/modal/add-team-modal";

function ProjectTeamSection({ projectId }: { projectId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = React.useState("1");

  return (
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <div className="flex items-center justify-between">
          <div className="w-fit">
            <ViewToggle
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              options={[
                { value: "1", label: "Client" },
                { value: "2", label: "Internal" },
              ]}
            />
          </div>

          <Button size="sm" leftIcon={<Plus />} onClick={onOpen}>
            Add Team
          </Button>
        </div>

        <div className="space-y-2">
          <TeamMemberCard />
          <TeamMemberCard />
          <TeamMemberCard />
          <TeamMemberCard />
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <AddTeamModal isOpen={isOpen} projectId={projectId} onClose={onClose} />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectTeamSection;
