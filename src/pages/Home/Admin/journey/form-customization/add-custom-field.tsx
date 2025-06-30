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
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSendConsultantInvite from "@/hooks/auth/use-send-consultant-invite";
import { addUserSchema } from "@/utils/validation-schema/admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";

export default function AddCustomFieldForm({ onClose }: ModalProps) {
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
    <div className="rounded-2xl p-4 space-y-3 bg-[#FAFAFA] border-brand-border border my-4">
      <Heading size="h5">Create new field</Heading>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Title</FormLabel>
                <FormControl>
                  <Input placeholder="Field Title" {...field} />
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
                <FormLabel>Field Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="h-11">
                    <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm w-full">
                      <SelectValue
                        placeholder={
                          <p className="text-brand-placeholder">Select field type</p>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      { value: "select", label: "Select" },
                      { value: "text", label: "Text" },
                      { value: "date", label: "Date" },
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
          <div className="flex justify-end">
            <Button size="sm" type="submit" isLoading={sendConsultantInvite.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
