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
import { formatCurrency } from "@/lib/utils";
import { Billing } from "@/types/billing.types";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import FinanceModal from "./finance-modal-form";
import FinanceViewModal from "./finance-overview-modal";
import MarkAsPaidModal from "./mark-as-paid-modal";

function FinanceTableRow({ billing }: { billing: Billing }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isMarkAsPaidModalOpen, setIsMarkAsPaidModalOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<"create" | "view" | "edit">("view");

  const handleEditClick = () => {
    setCurrentMode("edit");
    setIsModalOpen(true);
  };

  const handleViewClick = () => {
    setIsViewModalOpen(true);
  };

  const handleMarkAsPaidClick = () => {
    setIsMarkAsPaidModalOpen(true);
  };

  return (
    <>
      <TableRow>
        <TableCell>{billing?.client_name}</TableCell>
        <TableCell className="">{billing?.project_title}</TableCell>
        <TableCell>{formatCurrency(billing?.total_project_cost)}</TableCell>
        <TableCell>{formatCurrency(billing?.amount_paid)}</TableCell>
        <TableCell>{formatCurrency(billing?.outstanding_balance)}</TableCell>
        <TableCell>{format(billing?.next_payment_due_date, "dd MMM yyyy")}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.more />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleViewClick}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleMarkAsPaidClick}
                  disabled={billing?.outstanding_balance === "0"}
                >
                  Make a payment
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isModalOpen && (
          <FinanceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            mode={currentMode}
            billingData={billing}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isViewModalOpen && (
          <FinanceViewModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            billingData={billing}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isMarkAsPaidModalOpen && (
          <MarkAsPaidModal
            isOpen={isMarkAsPaidModalOpen}
            onClose={() => setIsMarkAsPaidModalOpen(false)}
            billingId={billing.id}
            currentAmountPaid={billing.amount_paid}
            totalProjectCost={billing?.total_project_cost}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default FinanceTableRow;
