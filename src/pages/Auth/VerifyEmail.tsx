import useResendVerificationEmail from "@/hooks/auth/use-resend-verification-email";
import useVerifyEmail from "@/hooks/auth/use-verify-email";
import { PAGES } from "@/lib/constants";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import VerificationCard from "./VerificationCard";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("token");
  const resendVerificationEmail = useResendVerificationEmail();
  const navigate = useNavigate();
  const verifyEmail = useVerifyEmail(token as string);

  useEffect(() => {
    if (verifyEmail.isSuccess && verifyEmail.data)
      setTimeout(() => navigate(PAGES.LOGIN_PAGE), 2000);
  }, [verifyEmail, navigate]);

  const resendVerification = async () => {
    resendVerificationEmail.mutateAsync({ email: email ?? "" }).catch(console.error);
  };

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
          onButtonClick={() => resendVerification()}
        />
      );
    }
    return (
      <VerificationCard title="Verifying your email..." noButton>
        <>
          <FaSpinner className="animate-spin mx-auto text-primary" size={40} />
        </>
      </VerificationCard>
    );
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 text-center max-w-sm w-full">{renderBody()}</div>
    </div>
  );
};

export default VerifyEmail;
