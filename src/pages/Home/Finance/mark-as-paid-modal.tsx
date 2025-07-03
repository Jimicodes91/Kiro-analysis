import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import DragNdrop from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useMarkFinanceRecordAsPaid from "@/hooks/finance/use-mark-finance_record_as-paid";
import { fileToBase64 } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  billingId: string;
  currentAmountPaid?: string;
  totalProjectCost?: string;
}

interface MarkAsPaidFormValues {
  amount_paid: number;
  payment_proof: File[];
}

function MarkAsPaidModal({
  isOpen,
  onClose,
  billingId,
  // currentAmountPaid,
}: MarkAsPaidModalProps) {
  const markAsPaid = useMarkFinanceRecordAsPaid(billingId);

  // const totalCost = totalProjectCost ? parseFloat(totalProjectCost) : 0;

  // Define mark as paid schema with dynamic validation
  const markAsPaidSchema = yup.object().shape({
    amount_paid: yup
      .number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === "" ||
          originalValue === null ||
          originalValue === undefined
          ? undefined
          : value;
      })
      .required("Amount paid is required")
      .typeError("Amount paid must be a number")
      .positive("Amount must be positive"),
    // .test(
    //   "equals-total-cost",
    //   "Amount must equal total project cost",
    //   function (value) {
    //     if (!value) return this.createError({ message: "Amount paid is required" });
    //     if (value < totalCost) {
    //       return this.createError({
    //         message: `Amount paid is less than total project cost ${formatCurrency(totalCost)}`,
    //       });
    //     }
    //     if (value > totalCost) {
    //       return this.createError({
    //         message: `Amount paid is more than total project cost ${formatCurrency(totalCost)}`,
    //       });
    //     }
    //     return true;
    //   }
    // ),
    payment_proof: yup
      .array()
      .of(
        yup
          .mixed<File>()
          .required()
          .test("is-file", "Must be a file", (value) => {
            return value instanceof File;
          })
      )
      .required()
      .default([]),
  });

  const form = useForm<MarkAsPaidFormValues>({
    resolver: yupResolver(markAsPaidSchema),
    defaultValues: {
      // amount_paid: currentAmountPaid ? parseFloat(currentAmountPaid) : undefined,
      amount_paid: undefined,
      payment_proof: [],
    },
    mode: "onChange",
  });

  const onSubmit = async (data: MarkAsPaidFormValues) => {
    // Convert file to base64 string if present
    let paymentProofString = "";

    if (data.payment_proof && data.payment_proof.length > 0) {
      try {
        paymentProofString = await fileToBase64(data.payment_proof[0]);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }

    const payload = {
      amount_paid: data.amount_paid.toString(),
      payment_proof: paymentProofString,
    };

    markAsPaid
      .mutateAsync(payload)
      .then(() => {
        onClose();
        form.reset();
      })
      .catch(console.error);
  };

  return (
    <Modal title="Make a payment" closeModal={onClose} isOpen={isOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <FormField
            control={form.control}
            name="amount_paid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount paid</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      type="number"
                      className="pl-7"
                      value={field.value === undefined ? "" : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? undefined : parseFloat(e.target.value);
                        field.onChange(isNaN(value as number) ? undefined : value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_proof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attach</FormLabel>
                <FormControl>
                  <DragNdrop
                    id="payment-proof-upload"
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-3">
            <Button type="submit" className="w-full" isLoading={markAsPaid.isPending}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

export default MarkAsPaidModal;
