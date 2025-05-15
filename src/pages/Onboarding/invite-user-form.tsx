import { Button } from "@/components/ui/button";
import {
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
import { cn } from "@/lib/utils";
import { inviteTeamSchema } from "@/utils/validation-schema/onboarding";
import { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { InferType } from "yup";

const InviteUserForm = ({
  index,
  form,
  remove,
  item,
}: {
  index: number;
  remove: (item: number) => void;
  item: FieldArrayWithId<
    {
      teamMembers?:
        | {
            email: string;
            role: string;
          }[]
        | undefined;
    },
    "teamMembers",
    "id"
  >;
  form: UseFormReturn<InferType<typeof inviteTeamSchema>>;
}) => {
  const sendConsultantInvite = useSendConsultantInvite();

  const handleInviteUser = async (index: number) => {
    const teamMembers = form.getValues("teamMembers");
    const data = teamMembers?.[index];
    const result = await form.trigger(`teamMembers.${index}`);

    if (result) {
      if (data) {
        sendConsultantInvite.mutateAsync(data).catch((err) => {
          console.error("Invite failed:", err);
        });
      }
    }
  };
  const showDeleteBtn = index > 0;

  return (
    <div key={item.id} className={cn("flex gap-2", !showDeleteBtn && "mr-10")}>
      <FormField
        control={form.control}
        name={`teamMembers.${index}.email`}
        render={({ field }) => {
          return (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="w-full"
                  key={item.id}
                  placeholder="Email"
                  {...field}
                  onChange={(val) => {
                    field.onChange(val);
                    form.trigger(`teamMembers.${index}.email`);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={form.control}
        name={`teamMembers.${index}.role`}
        key={item.id}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Role</FormLabel>
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                form.trigger(`teamMembers.${index}.role`);
              }}
              defaultValue={field.value}
            >
              <FormControl className="h-12 w-full">
                <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm w-full">
                  <SelectValue
                    placeholder={<p className="text-brand-placeholder">Select Role</p>}
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

      <div className="flex items-center self-center gap-1 pt-6">
        <Button
          isLoading={sendConsultantInvite.isPending}
          onClick={() => handleInviteUser(index)}
          disabled={sendConsultantInvite.isPending || sendConsultantInvite.isSuccess}
        >
          Invite user
        </Button>
        {showDeleteBtn && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
            className="text-red-500"
            disabled={sendConsultantInvite.isPending || sendConsultantInvite.isSuccess}
          >
            <AiOutlineDelete size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default InviteUserForm;
