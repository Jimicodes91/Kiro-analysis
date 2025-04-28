import { Button } from "@/components/ui/button";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import { Filter, Plus } from "lucide-react";
import EventCard from "../components/cards/event-card";
import AddProjectTaskModal from "../components/modal/add-project-task-modal";

function ProjectEventSection({ projectId }: { projectId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <div className="flex justify-end gap-3 items-center">
          <Button size="icon" variant="outline">
            <Filter />
          </Button>
          <Button size="sm" leftIcon={<Plus />} onClick={onOpen}>
            Create evemt
          </Button>
        </div>
        <div>
          <EventCard />
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <AddProjectTaskModal isOpen={isOpen} projectId={projectId} onClose={onClose} />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectEventSection;
