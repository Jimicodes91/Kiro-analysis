import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PaymentHistory } from "@/types/api.types";
import React from "react";

interface ViewReceiptModalProps {
  payment: PaymentHistory;
}

const ViewReceiptModal: React.FC<ViewReceiptModalProps & ModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadReceipt = async () => {
    if (!payment?.payment_proof_url) {
      console.error("No payment proof URL available");
      return;
    }

    setIsDownloading(true);

    try {
      // Fetch the file from the URL
      const response = await fetch(payment?.payment_proof_url);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // Create blob from response
      const blob = await response.blob();

      // Get file extension from URL or default to common image format
      const urlParts = payment?.payment_proof_url?.split(".");
      const extension = urlParts?.length > 1 ? urlParts?.pop() : "jpg";

      // Create filename
      const filename = `payment_receipt_${payment.id}.${extension}`;

      // Create temporary URL and download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      Toast.error("Failed to download receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal title="Receipt" closeModal={onClose} isOpen={isOpen}>
      <div>
        {payment?.payment_proof_url ? (
          <img
            alt="receipt"
            src={payment.payment_proof_url}
            className="w-full h-auto"
            onError={(e) => {
              console.error("Failed to load receipt image");
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="p-8 text-center text-gray-500">No receipt image available</div>
        )}
      </div>
      <div className="space-y-6 p-4">
        <Button
          onClick={handleDownloadReceipt}
          className="w-full"
          disabled={isDownloading || !payment?.payment_proof_url}
        >
          {isDownloading ? "Downloading..." : "Download receipt"}
        </Button>
      </div>
    </Modal>
  );
};

export default ViewReceiptModal;
