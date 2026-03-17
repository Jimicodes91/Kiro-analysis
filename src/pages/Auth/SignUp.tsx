import useWorkspaceSignup from "@/hooks/auth/use-workspace-signup";
import { PAGES } from "@/lib/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCookie } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { InferType } from "yup";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import { workspaceSignupSchema } from "../../utils/validation-schema/auth";

const SignUp: React.FC = () => {
  const workspaceSignup = useWorkspaceSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workspaceSignupSchema),
  });

  const onSubmit = async (data: InferType<typeof workspaceSignupSchema>) => {
    workspaceSignup
      .mutateAsync({
        email: data.email,
        password: data.password,
        name: data.name,
        workspace_name: data.workspace_name,
      })
      .then((response) => {
        // Store tokens in cookies
        setCookie("user_session_token", response.data.data.token);
        setCookie("user_session", JSON.stringify(response.data.data.user));

        toast.success("Workspace created successfully!");
        
        // Redirect based on role — SUPER_ADMIN goes to sysadmin home, others to projects
        const userRole = response.data.data.user?.role?.toUpperCase();
        if (userRole === "SUPER_ADMIN") {
          window.location.href = PAGES.HOME_PAGE;
        } else {
          window.location.href = PAGES.PROJECT_PAGE;
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to create workspace");
      });
  };

  return (
    <div className=" flex flex-col space-y-8 animate-in fade-in-0 duration-700 ease-in-out">
      <div>
        <div className="my-3 flex">
          <img src={Logo} alt="Logo" className="w-12" />
        </div>
        <h1 className="text-3xl font-medium">Get started</h1>
        <p className="text-brand-faint font-[500]">
          Welcome to Pylot - Let's create your workspace
        </p>
      </div>
      <form className="flex flex-col space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          type="text"
          placeholder="Your Name"
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
          type="text"
          placeholder="Workspace Name"
          {...register("workspace_name")}
          error={errors.workspace_name?.message}
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
          <MainButton type="submit" isLoading={workspaceSignup.isPending}>
            Create Workspace
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
