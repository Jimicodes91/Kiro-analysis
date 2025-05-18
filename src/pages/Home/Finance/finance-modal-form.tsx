import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAllContacts from "@/hooks/contacts/use-get-all-contacts";
import useCreateFinanceRecord from "@/hooks/finance/use-create-finance-record";
import useUpdateFinanceRecord from "@/hooks/finance/use-update-finance-record";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
import { cn } from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { Billing } from "@/types/billing.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const billingSchema = yup.object().shape({
  client_name: yup.string().required("Client name is required"),
  project_title: yup.string().required("Project title is required"),
  total_project_cost: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" || originalValue === null || originalValue === undefined
        ? undefined
        : value;
    })
    .required("Total amount is required")
    .positive("Amount must be positive")
    .typeError("Total project cost must be a number"),
  amount_paid: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" || originalValue === null || originalValue === undefined
        ? undefined
        : value;
    })
    .required("Amount paid is required")
    .min(0, "Amount cannot be negative")
    .typeError("Amount paid must be a number"),
  outstanding_balance: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" || originalValue === null || originalValue === undefined
        ? undefined
        : value;
    })
    .required("Outstanding balance is required")
    .min(0, "Balance cannot be negative")
    .typeError("Outstanding balance must be a number"),
  next_payment_due_date: yup.string().required("Next payment due date is required"),
});

type BillingSchemaType = yup.InferType<typeof billingSchema>;

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  billingData?: Billing;
}

function FinanceModal({ isOpen, onClose, mode, billingData }: FinanceModalProps) {
  const createBilling = useCreateFinanceRecord();
  const updateBilling = useUpdateFinanceRecord(billingData?.id || "");
  const clientsResponse = useGetAllContacts();
  const projectType = useGetAllProjectTypes();
  const projectTypeId = projectType?.data?.data?.data[0]?.id;
  const projectsResponse = useGetAllProjects(projectTypeId);
  const session = getUserSession();

  const clients = Array.isArray(clientsResponse?.data?.data?.data?.contacts)
    ? clientsResponse.data.data.data.contacts
    : [];

  const projects = Array.isArray(projectsResponse?.data?.data?.data)
    ? projectsResponse.data.data.data
    : [];

  const isLoading =
    clientsResponse.isLoading ||
    projectType.isLoading ||
    (projectTypeId && projectsResponse.isLoading) ||
    !session;

  const form = useForm<BillingSchemaType>({
    resolver: yupResolver(billingSchema),
    defaultValues: {
      client_name: billingData?.client_name || "",
      project_title: billingData?.project_title || "",
      total_project_cost: billingData?.total_project_cost
        ? parseFloat(billingData.total_project_cost)
        : undefined,
      amount_paid: billingData?.amount_paid
        ? parseFloat(billingData.amount_paid)
        : undefined,
      outstanding_balance: billingData?.outstanding_balance
        ? parseFloat(billingData.outstanding_balance)
        : undefined,
      next_payment_due_date: billingData?.next_payment_due_date || "",
    },
    mode: "onChange",
  });

  const { isDirty } = form.formState;

  const totalAmount = form.watch("total_project_cost");
  const amountPaid = form.watch("amount_paid");

  useEffect(() => {
    if (totalAmount !== undefined && amountPaid !== undefined) {
      const outstandingBalance = totalAmount - amountPaid;
      form.setValue(
        "outstanding_balance",
        outstandingBalance >= 0 ? outstandingBalance : 0
      );
    } else {
      form.setValue("outstanding_balance", 0);
    }
  }, [totalAmount, amountPaid, form]);

  const onSubmit = async (data: BillingSchemaType) => {
    const payload = {
      client_name: data.client_name,
      project_title: data.project_title,
      total_project_cost: data.total_project_cost?.toString() || "0",
      amount_paid: data.amount_paid?.toString() || "0",
      outstanding_balance: data.outstanding_balance?.toString() || "0",
      next_payment_due_date: format(data.next_payment_due_date, "yyyy/M/d"),
      organization_id: session?.company_id || "",
    };

    if (mode === "create") {
      createBilling
        .mutateAsync(payload)
        .then(() => {
          onClose();
          form.reset();
        })
        .catch(console.error);
    } else if (mode === "edit") {
      updateBilling
        .mutateAsync({
          ...payload,
        })
        .then(() => {
          onClose();
        })
        .catch(console.error);
    }
  };

  return (
    <Modal
      title={
        mode === "create"
          ? "Add billing"
          : mode === "edit"
            ? "Edit billing"
            : "View billing"
      }
      closeModal={onClose}
      isOpen={isOpen}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Loading form data...</p>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client name</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mode === "view"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Client name" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.name}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project title</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mode === "view"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Project title" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.name}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_project_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total project cost</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input
                        type="number"
                        className="pl-7"
                        placeholder="0.00"
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value);
                          field.onChange(isNaN(value as number) ? undefined : value);
                        }}
                        disabled={mode === "view"}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        placeholder="0.00"
                        value={field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? undefined
                              : parseFloat(e.target.value);
                          field.onChange(isNaN(value as number) ? undefined : value);
                        }}
                        disabled={mode === "view"}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="outstanding_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outstanding balance</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input
                        type="number"
                        className="pl-7"
                        placeholder="0.00"
                        value={field.value === undefined ? "" : field.value}
                        disabled={true}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_payment_due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Next payment due date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 justify-start font-normal rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={mode === "view"}
                        >
                          {field.value ? (
                            format(new Date(field.value), "dd MMM yyyy")
                          ) : (
                            <span className="text-brand-placeholder">Date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) =>
                          field.onChange(date ? format(date, "dd MMM yyyy") : "")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode !== "view" && (
              <div className="pt-3">
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={
                    createBilling.isPending
                    // || updateBilling.isPending
                  }
                  disabled={mode === "edit" && !isDirty}
                >
                  {mode === "create" ? "Save" : "Save changes"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      )}
    </Modal>
  );
}

export default FinanceModal;
