import useAuthLogin from "@/hooks/auth/use-auth-login";
import { PAGES } from "@/lib/constants";
import { setAuthUser } from "@/store/slices/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCookie } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import { loginSchema } from "../../components/validationSchema/auth";
import { LoginUser } from "../../types";

const Login: React.FC = () => {
  const dispatch = useDispatch();
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
        const { token, user } = response.data.data;
        // Store tokens in local storage
        setCookie("user_session_token", token);
        setCookie("user_session", JSON.stringify(user));
        // Store user data in Redux
        dispatch(setAuthUser(user));
        if (user.is_verified === 1) {
          navigate(PAGES.PROJECT_PAGE);
        } else {
          navigate(PAGES.ONBOARDING_PAGE);
        }
      });
  };

  return (
    <div className="flex flex-col animate-in fade-in-0 duration-700 ease-in-out">
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
        <Link
          to={PAGES.FORGOT_PASSWORD_PAGE}
          className="text-end text-black -top-3 relative text-sm font-bold cursor-pointer"
        >
          Forgot password?
        </Link>
        <MainButton type="submit" isLoading={authLogin.isPending}>
          Login
        </MainButton>
      </form>

      <div className="space-x-2 mt-4">
        <p className="text-center mt-4 text-sm text-black">
          Don't have an account?
          <Link
            className="text-primary pl-1 font-bold cursor-pointer"
            to={PAGES.REGISTER_PAGE}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
