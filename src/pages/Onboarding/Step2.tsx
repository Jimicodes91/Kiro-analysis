import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PAGES } from "@/lib/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { inviteTeamSchema } from "../../utils/validation-schema/onboarding";
import InviteUserForm from "./invite-user-form";
import { useOnboarding } from "./onboarding-context";

const Step2 = () => {
  const { onPrev } = useOnboarding();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(inviteTeamSchema),
    mode: "onChange",
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

  const onSubmit = () => {};

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-12">Invite your team</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-12 space-y-4">
            {fields.map((item, index) => {
              return (
                <InviteUserForm index={index} item={item} form={form} remove={remove} />
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
            <div className="flex gap-2 z-[20] relative">
              <Button variant="outline" onClick={() => navigate(PAGES.PROJECT_PAGE)}>
                Skip
              </Button>
              <Button
                onClick={() => {
                  navigate(PAGES.PROJECT_PAGE);
                }}
              >
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
