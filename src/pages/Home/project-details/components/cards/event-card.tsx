import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import useDisclosure from "@/hooks/use-disclosure";
import { EventDetails } from "@/types/api.types";
import { AnimatePresence } from "framer-motion";
import { MdGpsFixed } from "react-icons/md";
import DeleteEventModal from "../modal/delete-event-modal";

function EventCard({ event }: { event: EventDetails }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <div className="px-5 py-3 rounded-lg border flex gap-x-4 justify-between border-brand-border bg-[#F8F8F8]">
        <div className="space-y-2 flex gap-x-4 items-center">
          <div className="min-h-[140px] px-12 flex flex-col justify-center items-center bg-[#D9D9D94D] border border-brand-border rounded-lg">
            <p className="">June</p>
            <Heading size="h1">21</Heading>
          </div>
          <div>
            <p className="text-sm">11:00am - 2:00pm</p>
            <p className="font-bold text-xl">{event?.name}</p>
            <p className="text-gray-500 max-w-lg tex-xs">{event?.description}</p>
            <div className="flex gap-2 items-center pt-1">
              <MdGpsFixed />
              <p>{event?.venue}</p>
            </div>
          </div>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.more />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onOpen}>Delete Event</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <DeleteEventModal
            projectId={event.project_id}
            isOpen={isOpen}
            onClose={onClose}
            eventId={event.id}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default EventCard;
