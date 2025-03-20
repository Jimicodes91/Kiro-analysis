import React from "react";
import { MainButton } from "../../Components/Form/button";
import { FormInput } from "../../Components/Form/input";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../assets";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../Components/validationSchema/auth";
import { useForm } from "react-hook-form";

const Login: React.FC = () => {
  const navigate = useNavigate();

   const {
          register,
          handleSubmit,
          formState: { errors },
        } = useForm({
          resolver: yupResolver(loginSchema),
        });
    
    const onSubmit = () => {
      navigate("/onboarding")
      };

  return (
    <div className=" flex flex-col">
      <div className="my-3 flex">
        <img src={Logo} alt="Logo" className="w-12" />
      </div>
      <h1 className="text-3xl font-medium">Welcome back</h1>
      <p>Login to your account</p>
      <form className="flex flex-col w-96 space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
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
        />{" "}
        <Link
          to="/auth/forgot-password"
          className="text-end text-black  cursor-pointer "
        >
          Forgot password?
        </Link>
        <MainButton 
        type="submit"
        >Login</MainButton>
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
  );
};

export default Login;
