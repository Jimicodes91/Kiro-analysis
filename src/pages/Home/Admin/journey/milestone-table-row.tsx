import { TableCell, TableRow } from "@/components/ui/table";
import useGetAllProjectTypeMilestones, {
    ProjectTypeMilestone,
} from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";

function MilestoneTableRow({
  milestone,
}: {
  milestone: ProjectTypeMilestone;
  refetch: ReturnType<typeof useGetAllProjectTypeMilestones>["refetch"];
  projectTypeId: string;
}) {
  return (
    <TableRow>
      <TableCell>{milestone?.name}</TableCell>
      <TableCell>{milestone?.duration}</TableCell>
      <TableCell />
    </TableRow>
  );
}
export default MilestoneTableRow;
