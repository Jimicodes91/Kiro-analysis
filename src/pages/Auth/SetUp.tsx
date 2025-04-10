import React from "react";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";
import { Logo } from "../../assets";

const SetUp: React.FC = () => {
  return (
    <div className=" flex flex-col">
      <div className="my-3 flex">
        <img src={Logo} alt="Logo" className="w-12" />
      </div>
      <h1 className="text-3xl font-medium">Set up account</h1>
      <p>Set up your account</p>
      <form className="flex flex-col w-96 space-y-4 mt-4">
        <FormInput
          type="text"
          placeholder="Name"
          // register={register("name")}
          // error={errors.name?.message}
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

        <MainButton>Get Started</MainButton>
      </form>
    </div>
  );
};

export default SetUp;
