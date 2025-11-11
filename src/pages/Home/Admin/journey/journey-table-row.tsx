import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useDisclosure from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import DeleteJourneyModal from "./delete-journey-modal";
import EditJourneyFormModal from "./edit-jorney-modal";
import MilestoneTable from "./milestone-table";

function JourneyTableRow({
  projectType,
  index,
  refetch,
}: {
  projectType: ProjectType;
  index: number;
  refetch?: () => void;
}) {
  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isEditJourneyOpen,
    onOpen: onEditJourneyOpen,
    onClose: onEditJourneyClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteJourneyOpen,
    onOpen: onDeleteJourneyOpen,
    onClose: onDeleteJourneyClose,
  } = useDisclosure();
  const bg = index % 2 === 0 ? "bg-white" : "bg-[#F8F8F8]";

  return (
    <>
      <TableRow
        onClick={onToggle}
        className={cn(
          "cursor-pointer border-0 border-l border-r border-t",
          bg,
          `hover:${bg}`
        )}
      >
        <TableCell>{projectType?.name}</TableCell>
        <TableCell>{projectType?.progress_metrics?.days_to_completion}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.more />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onEditJourneyOpen();
                  }}
                >
                  Edit Journey
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onDeleteJourneyOpen();
                  }}
                >
                  Delete Journey
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
        <TableCell className="w-4 pr-8">
          <Button variant="ghost" size="icon">
            <IoIosArrowDown className={cn(isOpen ? "rotate-180" : "")} />
          </Button>
        </TableCell>
      </TableRow>
      <AnimatePresence initial={false}>
        {isOpen && <MilestoneTable isOpen={isOpen} projectType={projectType} bg={bg} />}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {isEditJourneyOpen && (
          <EditJourneyFormModal
            onClose={onEditJourneyClose}
            isOpen={isEditJourneyOpen}
            projectType={projectType}
          />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {isDeleteJourneyOpen && (
          <DeleteJourneyModal
            onClose={onDeleteJourneyClose}
            isOpen={isDeleteJourneyOpen}
            projectType={projectType}
            onSuccess={() => {
              refetch?.();
            }}
            onViewMilestones={() => {
              // Expand the milestones table when "View Milestones" is clicked
              if (!isOpen) {
                onToggle();
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
export default JourneyTableRow;
