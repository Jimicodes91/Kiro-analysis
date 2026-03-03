import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { LogoWithText } from "@/assets";
import Heading from "@/components/ui/heading";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import useResendVerificationEmail from "@/hooks/auth/use-resend-verification-email";
import useVerifyEmailWithOtp from "@/hooks/auth/use-verify-email-with-otp";
import { PAGES } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import VerificationCard from "./VerificationCard";

const FormSchema = z.object({
  pin: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
});

const VerifyAccountEmail = () => {
  const resendVerificationEmail = useResendVerificationEmail();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const verifyEmail = useVerifyEmailWithOtp();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    if (verifyEmail.isSuccess && verifyEmail.data)
      setTimeout(() => navigate(PAGES.LOGIN_PAGE), 2000);
  }, [verifyEmail, navigate]);

  const resendVerification = async () => {
    resendVerificationEmail.mutateAsync({ email: email ?? "" }).catch(console.error);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    verifyEmail.mutateAsync({ otp: data.pin }).catch(console.error);
  }

  const renderBody = () => {
    if (verifyEmail.isSuccess && verifyEmail.data) {
      return (
        <VerificationCard
          title="Email verified successfully!"
          description="Redirecting to login..."
          noButton
        />
      );
    }

    if (verifyEmail.isError && verifyEmail.error) {
      return (
        <VerificationCard
          title="Verification failed"
          description="Invalid or expired link."
          buttonText="Resend verification link"
          onButtonClick={() =>
            resendVerification().then(() => resendVerificationEmail.reset())
          }
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full  animate-in fade-in-0 duration-700 ease-in-out">
        <div className="bg-[#E0EFDE80] border border-brand-border rounded-[10px] py-8 px-6 text-center w-full">
          <div className="flex justify-center mb-4">
            <img src={LogoWithText} alt="Logo" className="w-28" />
          </div>
          <div className="space-y-1 mb-10">
            <Heading size="h3" className="text-black">
              Verify your email
            </Heading>
            <p className="text-[#0000004D] text-sm font-medium">
              We've sent a 4-digit code to your email address to continue
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP
                        pattern={REGEXP_ONLY_DIGITS}
                        maxLength={4}
                        className="space-x-3"
                        containerClassName="justify-center"
                        {...field}
                      >
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                fullWidth
                className="h-12"
                isLoading={verifyEmail.isPending}
              >
                Verify
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  };

  return <div>{renderBody()}</div>;
};

export default VerifyAccountEmail;
