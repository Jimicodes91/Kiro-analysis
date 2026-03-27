import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useSendSignupOtp from "@/hooks/auth/use-send-signup-otp";
import useVerifySignupOtp from "@/hooks/auth/use-verify-signup-otp";
import useWorkspaceSignup from "@/hooks/auth/use-workspace-signup";
import { companySizeList, industryList, PAGES } from "@/lib/constants";
import {
    credentialsSchema,
    otpSchema,
    profileCompanySchema,
} from "@/utils/validation-schema/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCookie } from "cookies-next";
import React, { useState } from "react";
import { CountrySelect } from "react-country-state-city";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InferType } from "yup";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";
import { FormInput } from "../../components/Form/input";

// ---------------------------------------------------------------------------
// Wizard state
// ---------------------------------------------------------------------------
interface WizardState {
  step: 1 | 2 | 3;
  email: string;
  password: string;
  signupToken: string | null;
}

const INITIAL_STATE: WizardState = {
  step: 1,
  email: "",
  password: "",
  signupToken: null,
};

// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------
const StepIndicator: React.FC<{ current: 1 | 2 | 3 }> = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {[1, 2, 3].map((s) => (
      <div key={s} className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            s === current
              ? "bg-primary text-white"
              : s < current
                ? "bg-primary/20 text-primary"
                : "bg-gray-200 text-gray-500"
          }`}
        >
          {s}
        </div>
        {s < 3 && (
          <div
            className={`w-8 h-[2px] ${s < current ? "bg-primary/40" : "bg-gray-200"}`}
          />
        )}
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Step 1 — Credentials
// ---------------------------------------------------------------------------
const CredentialsStep: React.FC<{
  onSuccess: (email: string, password: string) => void;
}> = ({ onSuccess }) => {
  const sendOtp = useSendSignupOtp();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: yupResolver(credentialsSchema) });

  const onSubmit = async (data: InferType<typeof credentialsSchema>) => {
    try {
      await sendOtp.mutateAsync({ email: data.email });
      onSuccess(data.email, data.password);
    } catch (error: any) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message;
      if (status === 409) {
        setError("email", { message: msg || "Email is already registered" });
      }
    }
  };

  return (
    <>
      <p className="text-brand-faint font-[500]">
        Welcome to Pylot — Let's create your workspace
      </p>
      <form className="flex flex-col space-y-5 mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput type="email" placeholder="Email" {...register("email")} error={errors.email?.message} />
        <FormInput type="password" placeholder="Password" {...register("password")} error={errors.password?.message} />
        <FormInput type="password" placeholder="Confirm Password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
        <div className="flex flex-col pt-4 space-y-2">
          <MainButton type="submit" isLoading={sendOtp.isPending}>Continue</MainButton>
          <p className="text-center text-sm text-black">
            Already have an account?
            <Link className="text-primary ml-1 font-bold cursor-pointer" to={PAGES.LOGIN_PAGE}>Login</Link>
          </p>
        </div>
      </form>
    </>
  );
};

// ---------------------------------------------------------------------------
// Step 2 — Verify OTP
// ---------------------------------------------------------------------------
const VerifyOtpStep: React.FC<{
  email: string;
  onSuccess: (signupToken: string) => void;
  onBack: () => void;
}> = ({ email, onSuccess, onBack }) => {
  const verifyOtp = useVerifySignupOtp();
  const resendOtp = useSendSignupOtp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(otpSchema) });

  const onSubmit = async (data: InferType<typeof otpSchema>) => {
    try {
      const response = await verifyOtp.mutateAsync({ email, otp: data.otp });
      onSuccess(response.data.data.signup_token);
    } catch {
      // Errors (invalid/expired OTP) shown via useCustomMutation default toast
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp.mutateAsync({ email });
      toast.success("Verification code resent!");
    } catch {
      // Errors handled by useCustomMutation
    }
  };

  return (
    <>
      <p className="text-brand-faint font-[500]">
        We sent a 6-digit code to <span className="font-bold text-black">{email}</span>
      </p>
      <form className="flex flex-col space-y-5 mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput type="text" placeholder="Enter 6-digit code" {...register("otp")} error={errors.otp?.message} />
        <div className="flex justify-end">
          <button type="button" onClick={handleResend} disabled={resendOtp.isPending} className="text-sm text-primary font-semibold hover:underline disabled:opacity-50">
            {resendOtp.isPending ? "Sending..." : "Resend Code"}
          </button>
        </div>
        <div className="flex flex-col pt-2 space-y-2">
          <MainButton type="submit" isLoading={verifyOtp.isPending}>Verify</MainButton>
          <button type="button" onClick={onBack} className="text-sm text-center text-black hover:underline">← Back to credentials</button>
        </div>
      </form>
    </>
  );
};

// ---------------------------------------------------------------------------
// Step 3 — Profile & Company
// ---------------------------------------------------------------------------
const ProfileCompanyStep: React.FC<{
  signupToken: string;
  password: string;
  onSuccess: () => void;
  onExpired: () => void;
  onBack: () => void;
}> = ({ signupToken, password, onSuccess, onExpired, onBack }) => {
  const navigate = useNavigate();
  const workspaceSignup = useWorkspaceSignup();
  const form = useForm({ resolver: yupResolver(profileCompanySchema), mode: "onChange" });

  const onSubmit = async (data: InferType<typeof profileCompanySchema>) => {
    try {
      const response = await workspaceSignup.mutateAsync({
        signup_token: signupToken,
        password,
        name: data.name,
        workspace_name: data.workspace_name,
        industry_type: data.industry_type,
        size: data.size,
        country: (data.country as any)?.name || "",
        address: data.address,
        city: data.city,
      });
      setCookie("user_session_token", response.data.data.token);
      setCookie("user_session", JSON.stringify(response.data.data.user));
      toast.success("Workspace created successfully!");
      navigate(PAGES.ONBOARDING_PAGE);
      onSuccess();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please start over.");
        onExpired();
      }
    }
  };

  return (
    <>
      <p className="text-brand-faint font-[500]">Almost there — tell us about yourself and your company</p>
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Full Name</FormLabel>
                <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="workspace_name" render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Company Name</FormLabel>
                <FormControl><Input placeholder="Company name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="industry_type" render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="h-12 w-full">
                      <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                        <SelectValue placeholder={<p className="text-brand-placeholder">Select industry</p>} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industryList.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="size" render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Company Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="h-12 w-full">
                      <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                        <SelectValue placeholder={<p className="text-brand-placeholder">Company size</p>} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companySizeList.map((item) => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Country</FormLabel>
                <FormControl className="h-12 w-full">
                  <CountrySelect
                    containerClassName="focus-visible:outline-none focus-visible:ring-1! focus-visible:ring-ring! shadow-sm"
                    inputClassName="flex h-12! w-full rounded-full! placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    onChange={(_country) => { field.onChange(_country); form.setValue("city", ""); }}
                    onTextChange={(e) => { if (!e.target.value) { form.resetField("country"); form.resetField("city"); form.clearErrors("country"); form.clearErrors("city"); } }}
                    onBlur={() => { if (field.value) { form.setValue("country", field.value); } }}
                    placeHolder="Select Country"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Company Address</FormLabel>
                <FormControl><Input placeholder="Company address" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>City</FormLabel>
                <FormControl><Input placeholder="City" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex flex-col pt-2 space-y-2">
              <Button type="submit" className="w-full h-[41px] rounded-3xl" isLoading={workspaceSignup.isPending}>Create Workspace</Button>
              <button type="button" onClick={onBack} className="text-sm text-center text-black hover:underline">← Back</button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// Main SignUp component
// ---------------------------------------------------------------------------
const SignUp: React.FC = () => {
  const [wizard, setWizard] = useState<WizardState>(INITIAL_STATE);

  const goToStep2 = (email: string, password: string) => {
    setWizard({ step: 2, email, password, signupToken: null });
  };

  const goToStep3 = (signupToken: string) => {
    setWizard((prev) => ({ ...prev, step: 3, signupToken }));
  };

  const reset = () => { setWizard(INITIAL_STATE); };

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in-0 duration-700 ease-in-out">
      <div>
        <div className="my-3 flex"><img src={Logo} alt="Logo" className="w-12" /></div>
        <h1 className="text-3xl font-medium">Get Started</h1>
      </div>
      <StepIndicator current={wizard.step} />
      {wizard.step === 1 && <CredentialsStep onSuccess={goToStep2} />}
      {wizard.step === 2 && <VerifyOtpStep email={wizard.email} onSuccess={goToStep3} onBack={reset} />}
      {wizard.step === 3 && (
        <ProfileCompanyStep
          signupToken={wizard.signupToken!}
          password={wizard.password}
          onSuccess={() => {}}
          onExpired={reset}
          onBack={() => setWizard((prev) => ({ ...prev, step: 2 }))}
        />
      )}
    </div>
  );
};

export default SignUp;
