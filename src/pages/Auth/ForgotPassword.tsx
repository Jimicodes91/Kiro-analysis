import useForgotPassword from "@/hooks/auth/use-forgot-password";
import { PAGES } from "@/lib/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { InferType } from "yup";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import { forgetPasswordSchema } from "../../utils/validation-schema/auth";
import VerificationCard from "./VerificationCard";

const ForgotPassword: React.FC = () => {
  const forgotPassword = useForgotPassword();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: InferType<typeof forgetPasswordSchema>) => {
    forgotPassword.mutateAsync(data).catch(console.error);
  };

  if (forgotPassword.isSuccess && forgotPassword.data) {
    return (
      <VerificationCard
        title="Reset link sent"
        description="Please click the link in the email sent to you to continue"
        buttonText="Back to login"
        onButtonClick={() => navigate(PAGES.LOGIN_PAGE)}
      />
    );
  }

  return (
    <div className=" flex flex-col space-y-8 animate-in fade-in-0 duration-700 ease-in-out">
      <div>
        <div className="my-3 flex">
          <img src={Logo} alt="Logo" className="w-12" />
        </div>
        <h1 className="text-3xl font-medium">Forgot Password</h1>
        <p className="text-sm text-brand-faint">
          We will send a reset link to your email
        </p>
      </div>
      <div>
        <form className="flex flex-col space-y-7" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            type="email"
            placeholder="Email"
            {...register("email")}
            error={errors.email?.message}
          />

          <MainButton type="submit" isLoading={forgotPassword.isPending}>
            Send reset link
          </MainButton>
        </form>
        <div>
          <p className="text-center mt-4 text-black">
            Don't have an account?
            <Link
              className="text-primary ml-1 font-bold cursor-pointer"
              to={PAGES.REGISTER_PAGE}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
