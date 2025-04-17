import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import { IoIosArrowDown } from "react-icons/io";

function PipeLineTableRow({ projectType }: { projectType: ProjectType }) {
  return (
    <>
      <TableRow className="cursor-pointer">
        <TableCell>{projectType?.name}</TableCell>
        <TableCell>{projectType?.progress_metrics?.days_to_completion}</TableCell>
        <TableCell>
          <Button variant="ghost" size="icon">
            <IoIosArrowDown />
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
export default PipeLineTableRow;
