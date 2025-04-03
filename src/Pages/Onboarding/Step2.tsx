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
import { useNavigate } from "react-router-dom";
import Toast from "../../Components/Toast";
import { sendConsultantInviteApi } from "../../Services";
import { useState } from "react";

const Step2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (data: { teamMembers?: TeamMember[] }) => {
    const teamMembers = data.teamMembers || [];
    
    // Update team members in Redux store
    dispatch(setTeamMembers(teamMembers));
    
    // Set loading state
    setLoading(true);
  
    try {
      // Detailed invite process with individual error handling
      await Promise.all(
        teamMembers.map(async (member) => {
          try {
            await sendConsultantInviteApi({
              email: member.email,
              role: member.role
            });
          } catch (error) {
            // Log the error for debugging
            console.error(`Failed to invite ${member.email}:`, error);
            // Rethrow to trigger the catch block in the main try-catch
            throw error;
          }
        })
      );
  
      // Show success toast
      Toast.success("Team members invited successfully");
  
      // Navigate to home screen
      navigate('/home');
    } catch (error) {
      // Handle any errors during invitation
      console.error("Error inviting team members:", error);
      
      // Generic error toast
      Toast.error("Failed to invite team members");
    } finally {
      // Reset loading state
      setLoading(false);
    }
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
                        { value: "consultant", label: "Consultant" },
                        { value: "client", label: "Client" },
                        { value: "customer", label: "Customer" },
                      ]}
                      register={register(`teamMembers.${index}.role`)}
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
          <div className="flex gap-2">
          <MainButton variant="outlined" onClick={()=>navigate('/home')} type="button">Skip</MainButton>
          <MainButton type="submit" isLoading={loading}>Save and continue</MainButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step2;