import React from "react";
import { MainButton } from "../../Components/Form/button";
import { FormInput } from "../../Components/Form/input";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../assets";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col">
      <div className="my-3 flex">
        <img src={Logo} alt="Logo" className="w-12" />
      </div>
      <h1 className="text-3xl font-medium">Get started</h1>
      <p>Welcome to Pylot - Lets create your account</p>
      <form className="flex flex-col w-96 space-y-4 mt-4">
        <FormInput
          type="email"
          placeholder="Email"
          // register={register("email")}
          // error={errors.email?.message}
        />

        <FormInput
          type="password"
          placeholder="Password"
          // register={register("password")}
          // error={errors.password?.message}
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          // register={register("confirmPassword")}
          // error={errors.confirmPassword?.message}
        />

        <MainButton>Sign Up</MainButton>
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
  );
};

export default SignUp;
