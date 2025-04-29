import { Button } from "@/components/ui/button";
import ViewToggle from "@/components/ui/view-toggle";
import useGetAllProjectMembers from "@/hooks/project-modules/project-members/use-get-all-project-mebers";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import React from "react";
import TeamMemberCard from "../components/cards/team-member-card";
import AddTeamModal from "../components/modal/add-team-modal";

function ProjectTeamSection({ projectId }: { projectId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = React.useState("1");
  const projectMembers = useGetAllProjectMembers(projectId);

  const renderBody = () => {
    if (projectMembers.isPending)
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              className="px-5 py-10 space-y-2 rounded-lg bg-slate-200 flex justify-between  animate-pulse"
              key={i}
            ></div>
          ))}
        </div>
      );

    if (projectMembers?.isError)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    if (projectMembers?.value?.data?.length === 0)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">
            No team member currently on this project
          </p>
        </div>
      );

    return (
      <div className="space-y-2">
        {projectMembers?.value?.data?.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    );
  };

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

        <div>{renderBody()}</div>
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
