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
import { DocumentTypeDetails } from "@/types/api.types";

function EventTypeTableRow({ eventType }: { eventType: DocumentTypeDetails }) {
  const { onOpen } = useDisclosure();
  return (
    <>
      <TableRow>
        <TableCell>{eventType?.name}</TableCell>
        <TableCell>{eventType?.description}</TableCell>
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
                  <DropdownMenuItem onClick={onOpen}>Edit Event Type</DropdownMenuItem>
                </>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </>
  );
}
export default EventTypeTableRow;
