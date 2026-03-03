import Modal from "@/components/Modal";
import { ModalProps } from "@/components/ui/alert-dialog";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSendConsultantInvite from "@/hooks/auth/use-send-consultant-invite";
import useGetAllPlans from "@/hooks/subscription/use-get-all-plans";
import { cn, getSelectableDate } from "@/lib/utils";
import { addCompanySubscriptionSchema } from "@/utils/validation-schema/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function SuscriptionModal({ onClose, isOpen }: ModalProps) {
  const sendConsultantInvite = useSendConsultantInvite();
  const allPlans = useGetAllPlans();
  const form = useForm<z.infer<typeof addCompanySubscriptionSchema>>({
    resolver: zodResolver(addCompanySubscriptionSchema),
  });

  const onSubmit = async (data: z.infer<typeof addCompanySubscriptionSchema>) => {
    // sendConsultantInvite
    //   .mutateAsync(data)
    //   .then(() => {
    //     onClose();
    //     form.reset();
    //   })
    //   .catch(console.error);
    console.log(data);
  };

  return (
    <Modal title="Subscription Upgrade" closeModal={onClose} isOpen={isOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <FormField
            control={form.control}
            name="plan_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Subscription plan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="h-11">
                    <SelectTrigger
                      isLoading={allPlans.isPending}
                      className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm w-full"
                    >
                      <SelectValue
                        placeholder={
                          <p className="text-brand-placeholder">Subscription plan</p>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allPlans?.value?.data?.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seats"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Period</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="h-11">
                    <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm w-full">
                      <SelectValue
                        placeholder={<p className="text-brand-placeholder">Period</p>}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      { value: "CONSULTANT", label: "Consultant" },
                      { value: "CLIENT", label: "Client" },
                      { value: "ADMIN", label: "Admin" },
                    ].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 justify-between">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel isRequired>Start date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "text-sm h-12 font-normal rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4",
                            !field.value && "text-muted-foreground"
                          )}
                          slotClassName="justify-start"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-brand-placeholder">Start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={getSelectableDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel isRequired>End date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "font-normal h-12 rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-brand-placeholder">End date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(form.watch("start_date"))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="pt-3">
            <Button type="submit" fullWidth isLoading={sendConsultantInvite.isPending}>
              Upgrade Subscription
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

export default SuscriptionModal;
