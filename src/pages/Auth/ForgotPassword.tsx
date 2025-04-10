import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import Toast from "../../components/Toast";
import { forgetPasswordSchema } from "../../components/validationSchema/auth";
import { forgotPasswordApi } from "../../services";
import { EmailProp } from "../../types";
import VerificationCard from "./VerificationCard";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: EmailProp) => {
    setLoading(true);
    try {
      const response = await forgotPasswordApi(data);
      setShowConfirmation(true);
      Toast.success(response.message || "Reset link sent");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = (error as { data?: string })?.data || "Link was not sent";
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!showConfirmation ? (
        <div className=" flex flex-col">
          <div className="my-3 flex">
            <img src={Logo} alt="Logo" className="w-12" />
          </div>
          <h1 className="text-3xl font-medium">Forgot password</h1>
          <p>We will send a reset link to your email</p>
          <form
            className="flex flex-col w-96 space-y-4 mt-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInput
              type="email"
              placeholder="Email"
              {...register("email")}
              error={errors.email?.message}
            />

            <MainButton type="submit" isLoading={loading}>
              Send reset link
            </MainButton>
          </form>
          <div className="space-x-2 mt-4">
            <p className="text-center mt-4 text-black">
              Don't have an account?
              <span
                className="text-primary ml-1 font-bold cursor-pointer"
                onClick={() => navigate("/auth/register")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      ) : (
        <VerificationCard
          title="Reset link sent"
          description="Please click the link in the email sent to you to continue"
          buttonText="Back"
          onButtonClick={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
};

export default ForgotPassword;
