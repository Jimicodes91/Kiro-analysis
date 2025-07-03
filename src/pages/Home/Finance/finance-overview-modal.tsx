import Modal from "@/components/Modal";
import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetIndividualFinanceRecord from "@/hooks/finance/use-get-individual-finance-record";
import { formatCurrency } from "@/lib/utils";
import { IndividualFinanceRecord, PaymentHistory } from "@/types/api.types";
import { Billing } from "@/types/billing.types";
import { format } from "date-fns";
import React, { useState } from "react";
import ViewReceiptModal from "./finance-view-receipt-modal";

interface ViewFinanceModalProps {
  billingData: Billing;
}

const FinanceViewModal: React.FC<ViewFinanceModalProps & ModalProps> = ({
  billingData,
  isOpen,
  onClose,
}) => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);

  const billingDetails = useGetIndividualFinanceRecord(billingData?.id);

  const handleViewReceipt = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedPayment(null);
  };

  const renderBody = () => {
    if (billingDetails.isSuccess && billingDetails.value) {
      return (
        <Overview
          billing={billingDetails?.value?.data}
          onViewReceipt={handleViewReceipt}
        />
      );
    }

    if (billingDetails.isError && billingDetails.error) {
      return <p>Something went wrong</p>;
    }
    return (
      <div className="space-y-4 animate-pulse pb-2">
        <div className="border-[1px] rounded-lg p-4 m-2 mt-4">
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <p className="h-8 w-full max-w-xs bg-slate-200"></p>
              <p className="h-8 w-20 bg-slate-200"></p>
            </div>
            <div className="bg-slate-200 p-4 rounded-lg flex-col border-brand-border border-[1px] h-[140px]"></div>
          </div>
        </div>
        <div className="h-[90px] bg-slate-200  m-2 rounded-lg"></div>
        <div className="h-[180px] bg-slate-200 m-2 mb-2 rounded-lg"></div>
      </div>
    );
  };

  return (
    <>
      {/* Main Overview Modal */}
      <Modal title="Overview" closeModal={onClose} isOpen={isOpen && !showReceiptModal}>
        <>{renderBody()}</>
      </Modal>

      {/* Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <ViewReceiptModal
          payment={selectedPayment}
          isOpen={showReceiptModal}
          onClose={handleCloseReceiptModal}
        />
      )}
    </>
  );
};

const PaymentHistoryTable = ({
  payments,
  onViewReceipt,
}: {
  payments: PaymentHistory[];
  onViewReceipt: (payment: PaymentHistory) => void;
}) => {
  return (
    <div className="border-[1px] rounded-lg p-4 m-2 mt-4">
      <p className="mb-3">Payment history</p>

      <div className="bg-white rounded-lg border border-[#0000001A] overflow-hidden">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="border-b border-#0000001A hover:bg-gray-50">
              <TableHead className="text-left py-3 px-4 font-semibold text-black text-sm h-auto">
                Date
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-semibold text-black text-sm h-auto">
                Amount
              </TableHead>
              <TableHead className="text-left py-3 px-4 font-semibold text-black text-sm h-auto">
                Receipt
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment: PaymentHistory) => (
              <TableRow
                key={payment.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0"
              >
                <TableCell className="py-2 px-4 text-sm text-black font-medium max-w-[80px]">
                  {format(payment.payment_date, "dd MMM yyyy")}
                </TableCell>
                <TableCell className="py-2 px-4 text-sm font-medium text-black max-w-[60px]">
                  {formatCurrency(payment.amount_paid)}
                </TableCell>
                <TableCell className="py-2 pl-4 text-sm text-black max-w-[60px]">
                  <Button
                    variant="link"
                    className="text-black underline p-0"
                    onClick={() => onViewReceipt(payment)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const Overview = ({
  billing,
  onViewReceipt,
}: {
  billing: IndividualFinanceRecord;
  onViewReceipt: (payment: PaymentHistory) => void;
}) => {
  return (
    <div className="animate-in fade-in-0 duration-700 ease-in-out">
      <div className="border-[1px] rounded-lg p-4 m-2 mt-4">
        <div className="space-y-4">
          <div className="flex flex-col">
            <p className="text-[#191819] font-bold text-2xl">{billing.project_title}</p>
            <p className="text-brand-fade text-base font-medium">{billing.client_name}</p>
          </div>
          <div className="bg-[#F8F8F8] p-4 rounded-lg flex-col border-brand-border border-[1px]">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3">
              <h3 className="text-sm text-brand-fade">Total fee</h3>
              <p className="text-sm font-semibold">
                {formatCurrency(billing?.total_project_cost)}
              </p>

              <h3 className="text-sm text-brand-fade">Outstanding</h3>
              <p className="text-sm font-semibold">
                {formatCurrency(billing?.outstanding_balance)}
              </p>

              <h3 className="text-sm text-brand-fade">Last payment date</h3>
              <p className="text-sm font-semibold">
                {format(billing?.lastPaymentDate, "dd MMM yyyy")}
              </p>

              <h3 className="text-sm text-brand-fade">Next payment due date</h3>
              <p className="text-sm font-semibold">
                {format(billing?.next_payment_due_date, "dd MMM yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="h-[90px] bg-white m-2 rounded-lg"> */}
      <PaymentHistoryTable
        payments={billing?.paymentHistory}
        onViewReceipt={onViewReceipt}
      />
    </div>
  );
};
export default FinanceViewModal;
