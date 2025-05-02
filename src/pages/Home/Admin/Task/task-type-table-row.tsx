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
import useDisclosure from "@/hooks/use-disclosure";
import { TaskTypeDetails } from "@/types/api.types";

function TaskTypeTableRow({ taskType }: { taskType: TaskTypeDetails }) {
  const { onOpen } = useDisclosure();
  return (
    <>
      <TableRow>
        <TableCell>{taskType?.name}</TableCell>
        <TableCell>{taskType?.description}</TableCell>
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
                  <DropdownMenuItem onClick={onOpen}>Edit Task Type</DropdownMenuItem>
                </>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
export default TaskTypeTableRow;
