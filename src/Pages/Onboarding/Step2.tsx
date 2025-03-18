import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { prevStep, setTeamMembers } from "../../Redux/store/slices/onboardingSlice";
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
    getValues,
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
  };

  const handleBack = () => {
    const currentTeamMembers = getValues("teamMembers") || [];
    dispatch(setTeamMembers(currentTeamMembers));
    dispatch(prevStep());
  };

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-12">Invite your team</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-12 space-y-4">
          {fields.map((item, index) => {
            const showDeleteButton = fields.length > 1;
            
            return (
              <div 
                key={item.id} 
                className={showDeleteButton ? "grid grid-cols-2 gap-4" : "grid grid-cols-2 gap-4"}
              >
                <FormInput
                  label="Email"
                  placeholder="Email"
                  {...register(`teamMembers.${index}.email`)}
                  error={errors.teamMembers?.[index]?.email?.message}
                />
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <FormSelect
                      label="Role"
                      options={[
                        { value: "admin", label: "Admin" },
                        { value: "member", label: "Member" },
                      ]}
                      {...register(`teamMembers.${index}.role`)}
                      error={errors.teamMembers?.[index]?.role?.message}
                    />
                  </div>
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
              </div>
            );
          })}
          <button type="button" onClick={() => append({ email: "", role: "" })} className="text-primary font-bold">
            + Add another user
          </button>
        </div>
        <div className="flex justify-between mt-12">
          <MainButton variant="outlined" onClick={handleBack} type="button">Back</MainButton>
          <MainButton type="submit">Save and continue</MainButton>
        </div>
      </form>
    </div>
  );
};

export default Step2;