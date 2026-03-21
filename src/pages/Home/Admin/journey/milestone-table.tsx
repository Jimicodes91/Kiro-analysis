import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
} from "@/components/ui/table";
import TableSkeletonRowLoader, { EmptyTable } from "@/components/ui/table-row-skeleton";
import useGetAllProjectTypeMilestones from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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

  const renderTableBody = () => {
    if (getMilestones.isPending)
      return <TableSkeletonRowLoader isSegemented={false} noOfRows={3} length={3} />;

    if (getMilestones?.value?.data?.length === 0)
      return <EmptyTable message="No milestone found" length={3} />;

    return (
      <>
        <TableBody>
          {getMilestones?.value?.data?.map((milestone) => (
            <MilestoneTableRow
              milestone={milestone}
              key={milestone.id}
              refetch={getMilestones.refetch}
              projectTypeId={projectType.id}
            />
          ))}
        </TableBody>
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
          colSpan={4}
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
          </Table>
        </motion.td>
      </motion.tr>
    </>
  );
}
export default MilestoneTable;
