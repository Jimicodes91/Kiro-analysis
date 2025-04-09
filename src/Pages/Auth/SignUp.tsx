import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import Toast from "../../components/Toast";
import { signupSchema } from "../../components/validationSchema/auth";
import { resendVerificationEmailApi, signUpAdminUserApi } from "../../services";
import { AdminSignUpFormProps } from "../../types";
import VerificationCard from "./VerificationCard";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: AdminSignUpFormProps) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const response = await signUpAdminUserApi(payload);
      setShowConfirmation(true);
      setEmail(data.email);
      Toast.success(response.message || "Signup Successful");
    } catch (error) {
      console.error("Error signing up:", error);
      const errorMessage = (error as { data?: string })?.data || "Error signing up";
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      const response = await resendVerificationEmailApi({ email });
      Toast.success(response.message || "Verification link sent");
    } catch (error) {
      console.error("Error resending verification:", error);
      const errorMessage =
        (error as { data?: string })?.data || "Error sending verification link";
      Toast.error(errorMessage);
    }
  };

  return (
    <>
      {!showConfirmation ? (
        <div className=" flex flex-col">
          <div className="my-3 flex">
            <img src={Logo} alt="Logo" className="w-12" />
          </div>
          <h1 className="text-3xl font-medium">Get started</h1>
          <p>Welcome to Pylot - Lets create your account</p>
          <form
            className="flex flex-col w-96 space-y-4 mt-4"
            onSubmit={handleSubmit(onSubmit)}
          >
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

            <MainButton type="submit" isLoading={loading}>
              Sign Up
            </MainButton>
          </form>
          <div className="space-x-2 mt-4">
            <p className="text-center mt-4 text-black">
              Already have an account?
              <span
                className="text-primary ml-1 font-bold cursor-pointer"
                onClick={() => navigate("/")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      ) : (
        <VerificationCard
          title="Email verification"
          email={email}
          buttonText="Back"
          onButtonClick={() => setShowConfirmation(false)}
          showResend={true}
          onResend={() => resendVerification()}
        />
      )}
    </>
  );
};

export default SignUp;
