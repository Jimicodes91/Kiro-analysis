import useAdminSignup from "@/hooks/auth/use-admin-signup";
import useResendVerificationEmail from "@/hooks/auth/use-resend-verification-email";
import { PAGES } from "@/lib/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { InferType } from "yup";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import { signupSchema } from "../../utils/validation-schema/auth";
import VerificationCard from "./VerificationCard";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const resendVerificationEmail = useResendVerificationEmail();
  const adminSignup = useAdminSignup();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: InferType<typeof signupSchema>) => {
    adminSignup.mutateAsync(data).catch(console.error);
  };

  const resendVerification = async () => {
    resendVerificationEmail.mutateAsync({ email: watch("email") }).catch(console.error);
  };

  if (adminSignup.isSuccess && adminSignup.data) {
    return (
      <VerificationCard
        title="Email verification"
        email={watch("email")}
        buttonText="Back to login"
        onResend={() => resendVerification()}
        showResend={true}
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
        <h1 className="text-3xl font-medium">Get started</h1>
        <p className="text-brand-faint font-[500]">
          Welcome to Pylot - Lets create your account
        </p>
      </div>
      <form className="flex flex-col space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          type="text"
          placeholder="Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <FormInput
          type="email"
          placeholder="Email"
          {...register("email")}
          error={errors.email?.message}
        />

        <FormInput
          type="password"
          placeholder="Password"
          {...register("password")}
          error={errors.password?.message}
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="flex flex-col pt-4 space-y-2">
          <MainButton type="submit" isLoading={adminSignup.isPending}>
            Sign Up
          </MainButton>
          <div className="space-x-2">
            <p className="text-center text-sm text-black">
              Already have an account?
              <Link
                className="text-primary ml-1 font-bold cursor-pointer"
                to={PAGES.LOGIN_PAGE}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
