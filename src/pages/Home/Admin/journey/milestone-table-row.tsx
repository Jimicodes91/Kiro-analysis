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
import useGetAllProjectTypeMilestones, {
  ProjectTypeMilestone,
} from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import useDisclosure from "@/hooks/use-disclosure";
import { AnimatePresence } from "framer-motion";
import DeleteMilestoneModal from "./delete-milestone-modal";
import MilestoneForm from "./milestone-form";

function MilestoneTableRow({
  milestone,
  refetch,
  projectTypeId,
}: {
  milestone: ProjectTypeMilestone;
  refetch: ReturnType<typeof useGetAllProjectTypeMilestones>["refetch"];
  projectTypeId: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteMilestoneOpen,
    onOpen: onDeleteMilestoneOpen,
    onClose: onDeleteMilestoneClose,
  } = useDisclosure();

  return (
    <>
      {isOpen ? (
        <MilestoneForm
          onClose={onClose}
          milestone={milestone}
          refetch={refetch}
          key={milestone.updated_at}
          projectTypeId={projectTypeId}
        />
      ) : (
        <TableRow className="">
          <TableCell>{milestone?.name}</TableCell>
          <TableCell>{milestone?.duration}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icons.more />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end" forceMount>
                <DropdownMenuGroup>
                  <>
                    <DropdownMenuItem onClick={onOpen}>Edit Milestone</DropdownMenuItem>
                    <DropdownMenuItem onClick={onDeleteMilestoneOpen}>
                      Delete Milestone
                    </DropdownMenuItem>
                  </>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      )}
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isDeleteMilestoneOpen && (
          <DeleteMilestoneModal
            isOpen={isDeleteMilestoneOpen}
            onClose={onDeleteMilestoneClose}
            milestone={milestone}
            projectTypeId={projectTypeId}
            onSuccess={() => {
              refetch();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
export default MilestoneTableRow;
