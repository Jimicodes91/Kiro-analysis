import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { prevStep, nextStep, setTeamMembers } from "../../Redux/store/slices/onboardingSlice";
import { RootState } from "../../Redux/store";
import { inviteTeamSchema } from "../../Components/validationSchema/onboarding";
import { FormInput } from "../../Components/Form/input";
import { FormSelect } from "../../Components/Form/select";
import { MainButton } from "../../Components/Form/button";
import { TeamMember } from "../../types";

const Step2 = () => {
  const dispatch = useDispatch();
  const storedTeamMembers = useSelector((state: RootState) => state.onboarding.teamMembers);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(inviteTeamSchema),
    defaultValues: { teamMembers: storedTeamMembers },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teamMembers",
  });

  const onSubmit = (data: { teamMembers?: TeamMember[] }) => {
      const teamMembers = data.teamMembers || [];
      dispatch(setTeamMembers(teamMembers));
      dispatch(nextStep());
    };

  return (
    <div>
         {/* <div className=" bg-white z-10 sticky top-10"> */}
      <h1 className="text-2xl font-bold mb-6">Invite Your Team</h1>
        {/* </div> */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((item, index) => (
          <div key={item.id} className="grid grid-cols-[45%_45%_10%] gap-4 items-center">
            <FormInput
              label="Email"
              placeholder="Email"
              {...register(`teamMembers.${index}.email`)}
              error={errors.teamMembers?.[index]?.email?.message}
            />
            <FormSelect
              label="Role"
              options={[
                { value: "admin", label: "Admin" },
                { value: "member", label: "Member" },
              ]}
              {...register(`teamMembers.${index}.role`)}
              error={errors.teamMembers?.[index]?.role?.message}
            />
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)} className="text-red-500"><AiOutlineDelete /></button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ email: "", role: "" })} className="text-primary font-bold">
          + Add another user
        </button>
        <div className="flex justify-between mt-12">
          <MainButton variant="outlined" className="px-6" onClick={() => dispatch(prevStep())} type="button">Back</MainButton>
          <MainButton type="submit">Save and continue</MainButton>
        </div>
      </form>
    </div>
  );
};

export default Step2;
