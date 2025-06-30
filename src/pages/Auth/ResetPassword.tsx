import useResetPassword from "@/hooks/auth/use-reset-password";
import { PAGES } from "@/lib/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InferType } from "yup";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import Toast from "../../components/Toast";
import { resetPasswordSchema } from "../../utils/validation-schema/auth";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = (data: InferType<typeof resetPasswordSchema>) => {
    if (!token) {
      return Toast.error("No token available");
    }
    resetPassword
      .mutateAsync({
        token: token,
        newPassword: data.newPassword,
      })
      .then(() => navigate(PAGES.LOGIN_PAGE))
      .catch(console.error);
  };

  return (
    <div className="flex flex-col animate-in fade-in-0 duration-700 ease-in-out">
      <div className="my-3 flex">
        <img src={Logo} alt="Logo" className="w-12" />
      </div>
      <h1 className="text-3xl font-medium">Reset Password</h1>
      <p>Create a new password here</p>
      <form
        className="flex flex-col w-96 space-y-4 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />
        <FormInput
          type="password"
          placeholder="Confirm New Password"
          {...register("confirmNewPassword")}
          error={errors.confirmNewPassword?.message}
        />

        <MainButton type="submit" isLoading={resetPassword.isPending}>
          Reset Password
        </MainButton>
      </form>
    </div>
  );
};

export default ResetPassword;
