import React from "react";
import { Logo } from "../../assets";
import { MainButton } from "../../components/Form/button";

interface VerificationCardProps {
  title: string;
  description?: React.ReactNode;
  email?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showResend?: boolean;
  onResend?: () => void;
  noButton?: boolean;
  children?: React.ReactElement;
}

const VerificationCard: React.FC<VerificationCardProps> = ({
  title,
  description,
  email,
  buttonText,
  onButtonClick,
  showResend = false,
  onResend,
  noButton = false,
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full animate-in fade-in-0 duration-700 ease-in-out">
      <div className="bg-[#E0EFDE80] border border-brand-border rounded-[10px] p-10 text-center w-full">
        <div className="flex justify-center mb-4">
          <img src={Logo} alt="Logo" className="w-12" />
        </div>
        <h2 className="text-[32px] text-black font-semibold mb-2">{title}</h2>
        <p className="text-[#0000004D] text-[16px] font-medium mb-4">
          {email ? (
            <>
              Click the link sent to <br />
              <span className="text-black">{email}</span> to continue
            </>
          ) : (
            description
          )}
        </p>
        {!noButton && (
          <>
            <div className="mt-8">
              <MainButton onClick={onButtonClick} className="w-full bg-black py-2">
                {buttonText}
              </MainButton>
            </div>
            {showResend && onResend && (
              <p className="text-[16px] text-[#00000080] mt-4">
                Didn’t receive link?
                <button
                  onClick={onResend}
                  className="text-black text-[16px] font-medium hover:underline ml-1"
                >
                  Resend email
                </button>
              </p>
            )}
          </>
        )}

        {children}
      </div>
    </div>
  );
};

export default VerificationCard;
