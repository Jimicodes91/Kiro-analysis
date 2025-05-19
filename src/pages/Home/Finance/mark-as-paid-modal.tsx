// import Modal from "@/components/Modal";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";
// import * as yup from "yup";

// // Define mark as paid schema
// const markAsPaidSchema = yup.object().shape({
//   amount_paid: yup
//     .number()
//     .required("Amount paid is required")
//     .positive("Amount must be positive"),
//   receipt: yup.mixed(),
// });

// interface MarkAsPaidModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   billingId: string;
//   currentAmountPaid: string;
// }

// interface MarkAsPaidFormValues {
//   amount_paid: number;
//   receipt?: File | null;
// }

// function MarkAsPaidModal({
//   isOpen,
//   onClose,
//   billingId,
//   currentAmountPaid
// }: MarkAsPaidModalProps) {
//   // Get data from hooks
//   // const markAsPaid = useMarkBillingAsPaid(billingId);

//   const form = useForm<MarkAsPaidFormValues>({
//     resolver: yupResolver(markAsPaidSchema),
//     defaultValues: {
//       amount_paid: 0,
//       receipt: null,
//     },
//     mode: "onChange",
//   });

//   const onSubmit = async (data: MarkAsPaidFormValues) => {
//     // Prepare formData for file upload
//     const formData = new FormData();
//     formData.append("amount_paid", data.amount_paid.toString());
//     if (data.receipt) {
//       formData.append("receipt", data.receipt);
//     }

//     markAsPaid
//       .mutateAsync(formData)
//       .then(() => {
//         onClose();
//         form.reset();
//       })
//       .catch(console.error);
//   };

//   return (
//     <Modal title="Mark as paid" closeModal={onClose} isOpen={isOpen}>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
//           <FormField
//             control={form.control}
//             name="amount_paid"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Amount paid</FormLabel>
//                 <FormControl>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
//                     <Input
//                       type="number"
//                       className="pl-7"
//                       placeholder="0.00"
//                       {...field}
//                       onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="receipt"
//             render={({ field: { value, onChange, ...fieldProps } }) => (
//               <FormItem>
//                 <FormLabel>Attach</FormLabel>
//                 <FormControl>
//                   <div className="border-2 border-dashed border-gray-200 rounded-md p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-6 w-6 mb-2 text-gray-400"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                       />
//                     </svg>
//                     <p className="text-sm text-gray-500">
//                       Drag file here to upload or choose file
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       PDF, DOCX, XLSX, PNG, JPG format, up to 50MB
//                     </p>
//                     <Input
//                       type="file"
//                       className="hidden"
//                       id="receipt-upload"
//                       accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0] || null;
//                         onChange(file);
//                       }}
//                       {...fieldProps}
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       className="mt-2"
//                       onClick={() => {
//                         document.getElementById("receipt-upload")?.click();
//                       }}
//                     >
//                       Select file
//                     </Button>
//                     {value && (
//                       <p className="text-xs text-gray-600 mt-2">
//                         Selected: {value instanceof File ? value.name : ""}
//                       </p>
//                     )}
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="pt-3">
//             <Button type="submit" className="w-full" isLoading={markAsPaid.isPending}>
//               Submit
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </Modal>
//   );
// }

// export default MarkAsPaidModal;
