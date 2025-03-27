import React, { useState, useEffect } from "react";
import { MainButton } from "../../Components/Form/button";
import { FormInput } from "../../Components/Form/input";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "../../assets";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "../../Components/validationSchema/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPasswordFormProps } from "../../types";
import { resetPasswordApi } from "../../Services";
import Toast from "../../Components/Toast";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get('token');
    
    if (urlToken) {
      setToken(urlToken);
    } 

  }, [location, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormProps) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error('No token available');
      }
      const payload = {
        token: token,
        newPassword: data.newPassword,
      };
      const response = await resetPasswordApi(payload);
      navigate('/');
      Toast.success(response.message || "Password Reset Successful");
    } catch (error) {
      console.error("Error resetting password:", error);
      const errorMessage = (error as { data?: string })?.data || "Password Reset Failed";
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
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

        <MainButton type="submit" isLoading={loading}>
          Reset Password
        </MainButton>
      </form>
    </div>
  );
};

export default ResetPassword;