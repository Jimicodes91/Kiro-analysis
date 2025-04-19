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
import { useMultiSendInvite } from "@/hooks/auth/use-send-consultant-invite";
import { PAGES } from "@/lib/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { inviteTeamSchema } from "../../components/validationSchema/onboarding";
import { TeamMember } from "../../types";
import { useOnboarding } from "./onboarding-context";

const Step2 = () => {
  const { onPrev } = useOnboarding();

  const navigate = useNavigate();
  const sendInvite = useMultiSendInvite();

  const form = useForm({
    resolver: yupResolver(inviteTeamSchema),
    defaultValues: {
      teamMembers: [
        {
          email: "",
          role: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "teamMembers",
    control: form.control,
    rules: {
      required: "Please append at least 1 item",
      minLength: 1,
    },
  });

  const onSubmit = async (data: { teamMembers?: TeamMember[] }) => {
    const teamMembers = data.teamMembers;
    if (teamMembers) {
      try {
        const results = await sendInvite.mutateAsync(teamMembers);
        console.log("All done:", results);
      } catch (err) {
        console.error("One or more failed:", err);
      }
    } else {
      return;
    }
  };

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-12">Invite your team</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-12 space-y-4">
            {fields.map((item, index) => {
              const showDeleteButton = fields.length > 1;
              return (
                <div
                  key={item.id}
                  className={
                    showDeleteButton ? "grid grid-cols-2 gap-4" : "grid grid-cols-2 gap-4"
                  }
                >
                  <FormField
                    control={form.control}
                    name={`teamMembers.${index}.email`}
                    render={({ field }) => {
                      console.log(field);
                      return (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              key={item.id}
                              placeholder="Email"
                              {...field}
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
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="h-12 w-full">
                            <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm w-full">
                              <SelectValue
                                placeholder={
                                  <p className="text-brand-placeholder">Select Role</p>
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showDeleteButton && (
                    <div className="flex items-center self-center pt-6">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => append({ email: "", role: "" })}
              className="text-primary font-bold"
            >
              + Add another user
            </button>
          </div>
          <div className="flex justify-between mt-10">
            <Button variant="outline" onClick={onPrev}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(PAGES.PROJECT_PAGE)}>
                Skip
              </Button>
              <Button type="submit" isLoading={sendInvite.isPending}>
                Save and continue
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Step2;
