import useAuthLogin from "@/hooks/auth/use-auth-login";
import { PAGES } from "@/lib/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCookie } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InferType } from "yup";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import { loginSchema } from "../../utils/validation-schema/auth";

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

  const onSubmit = async (data: InferType<typeof loginSchema>) => {
    authLogin
      .mutateAsync({
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        // Normalize role to uppercase before storing
        const user = response.data.data.user;
        if (user.role) {
          user.role = user.role.toUpperCase() as any;
        }

        // Store tokens in cookies with normalized role
        setCookie("user_session_token", response.data.data.token);
        setCookie("user_session", JSON.stringify(user));

        toast.success("Login successful!");

        const userRole = user.role;

        // Handle different user roles and do full page reload to update routes
        if (userRole === "SUPER_ADMIN") {
          window.location.href = PAGES.SYSADMIN_HOME_PAGE;
        } else if (userRole === "CLIENT") {
          window.location.href = PAGES.HOME_PAGE;
        } else if (userRole === "ADMIN" || userRole === "CONSULTANT") {
          window.location.href = PAGES.PROJECT_PAGE;
        } else {
          // Default to home page
          window.location.href = PAGES.HOME_PAGE;
        }
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message || "Login failed";
        toast.error(errorMessage);
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
