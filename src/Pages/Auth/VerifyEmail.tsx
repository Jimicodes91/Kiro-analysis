import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaSpinner, 
    // FaCheckCircle, FaTimesCircle
 } from "react-icons/fa";
import { resendVerificationEmailApi, verifyEmailApi } from "../../Services";
import VerificationCard from "./VerificationCard";
import Toast from "../../Components/Toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        await verifyEmailApi({token});
        setStatus("success");
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        console.log(error)
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const resendVerification = async () => {
    const email = "";
    try {
      const response = await resendVerificationEmailApi({ email });
      Toast.success(response.message || "Verification link sent")
    } catch (error) {
      console.error("Error resending verification:", error);
      const errorMessage = (error as { data?: string })?.data || "Error sending verification link";
      Toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 text-center max-w-sm w-full">
        {status === "loading" && (
        <VerificationCard
        title="Verifying your email..."
        noButton
        >
          <>
            <FaSpinner className="animate-spin mx-auto text-primary" size={40} />
          </>
        </VerificationCard>
      
        )}
        {status === "success" && (
          <VerificationCard
          title="Email verified successfully!"
          description="Redirecting to login..."
          noButton
        />
        )}
        {status === "error" && (
        <VerificationCard
        title="Verification failed"
        description="Invalid or expired link."
        buttonText="Resend verification link"
        onButtonClick={() => resendVerification()}
      />
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
