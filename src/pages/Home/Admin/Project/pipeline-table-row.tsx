import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProjectType } from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useDisclosure from "@/hooks/use-disclosure";
import { IoIosArrowDown } from "react-icons/io";

function PipeLineTableRow({ projectType }: { projectType: ProjectType }) {
  const { onOpen } = useDisclosure();
  return (
    <>
      <TableRow className="cursor-pointer">
        <TableCell>{projectType?.name}</TableCell>
        <TableCell>{projectType?.progress_metrics?.days_to_completion}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <IoIosArrowDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <>
                  <DropdownMenuItem onClick={onOpen}>Edit User</DropdownMenuItem>
                </>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
export default PipeLineTableRow;
