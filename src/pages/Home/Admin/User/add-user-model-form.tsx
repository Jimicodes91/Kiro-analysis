import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSendConsultantInvite from "@/hooks/auth/use-send-consultant-invite";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import Modal from "../../../../components/Modal";
import { addUserSchema } from "../../../../components/validationSchema/admin";

function AddUserModalForm({ onClose }: ModalProps) {
  const sendConsultantInvite = useSendConsultantInvite();
  const form = useForm({
    resolver: yupResolver(addUserSchema),
  });

  const onSubmit = async (data: InferType<typeof addUserSchema>) => {
    sendConsultantInvite
      .mutateAsync(data)
      .then(() => {
        onClose();
        form.reset();
      })
      .catch(console.error);
  };
  return (
    <Modal title="Add User" closeModal={onClose} fullHeight={false}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="h-11">
                    <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm w-full">
                      <SelectValue
                        placeholder={
                          <p className="text-brand-placeholder">Select role</p>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      { value: "consultant", label: "Consultant" },
                      { value: "client", label: "Client" },
                      { value: "customer", label: "Customer" },
                    ].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" isLoading={sendConsultantInvite.isPending}>
            Add User
          </Button>
        </form>
      </Form>
    </Modal>
  );
}

export default AddUserModalForm;
