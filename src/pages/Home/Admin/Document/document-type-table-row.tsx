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
import { AnimatePresence } from "framer-motion";
import AddDocumentModal from "./add-document-type-model";

function DocumentTableRow({ documentType }: { documentType: DocumentTypeDetails }) {
  const { onOpen, isOpen, onClose } = useDisclosure();
  return (
    <>
      <TableRow>
        <TableCell>{documentType?.name}</TableCell>
        <TableCell>{documentType?.description}</TableCell>
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
                  <DropdownMenuItem onClick={onOpen}>Edit Document Type</DropdownMenuItem>
                </>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <AddDocumentModal
            isOpen={isOpen}
            onClose={onClose}
            documentType={documentType}
          />
        )}
      </AnimatePresence>
    </>
  );
}
export default DocumentTableRow;
