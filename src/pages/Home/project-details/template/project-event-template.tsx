import { Button } from "@/components/ui/button";
import useGetProjectEvents from "@/hooks/project-modules/events/use-get-project-events";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import EventCard from "../components/cards/event-card";
import CreateEventModal from "../components/modal/create-event-modal";

function ProjectEventSection({
  projectId,
  mode = "edit",
}: {
  projectId: string;
  mode?: "readonly" | "edit";
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const projectEvents = useGetProjectEvents(projectId);

  const renderBody = () => {
    if (projectEvents.isPending)
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

    if (projectEvents?.isError)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    if (projectEvents?.value?.data?.length === 0)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">
            No event currently on this project
          </p>
        </div>
      );

    return (
      <div className="space-y-2">
        {projectEvents?.value?.data?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <div className="flex justify-end gap-3 items-center">
          {mode === "edit" && (
            <Button size="sm" onClick={onOpen}>
              Create evemt
            </Button>
          )}
        </div>
        <div>{renderBody()}</div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <CreateEventModal isOpen={isOpen} projectId={projectId} onClose={onClose} />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectEventSection;
