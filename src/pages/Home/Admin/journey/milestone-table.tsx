import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllProjectTypeMilestones from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useDisclosure from "@/hooks/use-disclosure";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LuPlus } from "react-icons/lu";
import MilestoneForm from "./milestone-form";
import MilestoneTableRow from "./milestone-table-row";

function MilestoneTable({
  projectType,
  bg,
  isOpen,
}: {
  projectType: ProjectType;
  bg: string;
  isOpen: boolean;
}) {
  const getMilestones = useGetAllProjectTypeMilestones(projectType.id);
  const { isOpen: isCreateFormOpen, onOpen, onClose } = useDisclosure();

  const renderTableBody = () => {
    if (getMilestones.isPending)
      return <TableSkeletonRowLoader isSegemented={false} noOfRows={3} length={3} />;

    if (getMilestones?.value?.data?.length === 0)
      return <EmptyTable message="No milestone found" length={3} />;

    return (
      <>
        <>
          {getMilestones?.value?.data?.map((milestone) => (
            <MilestoneTableRow
              milestone={milestone}
              key={milestone.id}
              refetch={getMilestones.refetch}
            />
          ))}
        </>
      </>
    );
  };

  return (
    <>
      <motion.tr
        key="content"
        initial="collapsed"
        animate="open"
        exit="collapsed"
        layout
        variants={{
          open: { opacity: 1, height: "auto" },
          collapsed: { opacity: 0, height: 0 },
        }}
        transition={{ duration: 0.4 }}
        className={cn("!border-t-0 border-l  border-b border-r origin-top", bg)}
      >
        <motion.td
          className="p-2"
          colSpan={3}
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            collapsed: { scale: 0.8, opacity: 0 },
            open: { scale: 1, opacity: 1 },
          }}
          transition={{ duration: 0.4 }}
        >
          <Table>
            <TableHeader className="!border rounded-l-full">
              <TableHead className="w-[55%] lg:w-[49%]">Stage</TableHead>
              <TableHead>Duration (days)</TableHead>
              <TableHead className="w-4"></TableHead>
            </TableHeader>
            <>{renderTableBody()}</>
            {isCreateFormOpen && (
              <MilestoneForm
                onClose={onClose}
                refetch={getMilestones.refetch}
                key={String(isOpen)}
                projectTypeId={projectType.id}
              />
            )}
            <TableRow className="!bg-white !border-t-0">
              <TableCell colSpan={3} className="w-fit">
                <div className="grid">
                  <div className="items-center gap-3 flex">
                    <Button
                      leftIcon={<LuPlus />}
                      variant="ghost"
                      onClick={onOpen}
                      size="sm"
                      className="px-0 hover:bg-transparent"
                    >
                      Add stage
                    </Button>

                    <Separator className="w-fit" />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </Table>
        </motion.td>
      </motion.tr>
    </>
  );
}
export default MilestoneTable;
