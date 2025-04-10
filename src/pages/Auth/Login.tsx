import useAuthLogin from "@/hooks/auth/use-auth-login";
import { PAGES } from "@/lib/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCookie } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import { loginSchema } from "../../components/validationSchema/auth";
import { LoginUser } from "../../types";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const authLogin = useAuthLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginUser) => {
    authLogin
      .mutateAsync({
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        // Store tokens in local storage
        setCookie("user_session_token", response.data.data.token);
        setCookie("user_session", JSON.stringify(response.data.data.user));
        if (response.data.data.user.is_verified === 1) {
          navigate(PAGES.PROJECT_PAGE);
        } else {
          navigate(PAGES.ONBOARDING_PAGE);
        }
      });
  };

  return (
    <div className=" flex flex-col">
      <div className="my-3 flex">
        <img src={Logo} alt="Logo" className="w-12" />
      </div>
      <h1 className="text-3xl font-medium">Welcome back</h1>
      <p>Login to your account</p>
      <form
        className="flex flex-col w-full space-y-4 mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <Link to="/auth/forgot-password" className="text-end text-black  cursor-pointer ">
          Forgot password?
        </Link>
        <MainButton type="submit" isLoading={authLogin.isPending}>
          Login
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
  );
};

export default Login;
