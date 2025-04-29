import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useDisclosure from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import MilestoneTable from "./milestone-table";

function JourneyTableRow({
  projectType,
  index,
}: {
  projectType: ProjectType;
  index: number;
}) {
  const { isOpen, onToggle } = useDisclosure();
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
        <TableCell className="w-4 pr-8">
          <Button variant="ghost" size="icon">
            <IoIosArrowDown />
          </Button>
        </TableCell>
      </TableRow>
      <AnimatePresence initial={false}>
        {isOpen && <MilestoneTable isOpen={isOpen} projectType={projectType} bg={bg} />}
      </AnimatePresence>
    </>
  );
}
export default JourneyTableRow;
