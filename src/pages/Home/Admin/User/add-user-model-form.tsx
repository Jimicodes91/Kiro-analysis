import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "../../../../components/Form/input";
import { FormSelect } from "../../../../components/Form/select";
import Modal from "../../../../components/Modal";
import { addUserSchema } from "../../../../components/validationSchema/admin";
import { sendConsultantInviteApi } from "../../../../services";
import { TeamMember } from "../../../../types";

function AddUserModalForm({ onClose }: ModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addUserSchema),
  });

  const onSubmit = async (data: TeamMember) => {
    setLoading(true);
    try {
      await sendConsultantInviteApi(data);
      onClose();
      reset();
    } catch (error) {
      console.error(`Failed to invite ${data.email}:`, error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="Add User" closeModal={onClose} fullHeight={false}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
        <FormInput
          label="Email"
          placeholder="Email"
          {...register("email")}
          error={errors.email?.message}
        />
        <FormSelect
          label="Role"
          options={[
            { value: "consultant", label: "Consultant" },
            { value: "client", label: "Client" },
            { value: "customer", label: "Customer" },
          ]}
          register={register("role")}
          error={errors.role?.message}
        />
        <Button type="submit" isLoading={loading}>
          Add User
        </Button>
      </form>
    </Modal>
  );
}

export default AddUserModalForm;
