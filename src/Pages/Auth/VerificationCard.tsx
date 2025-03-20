import React from "react";
import { Logo } from "../../assets";
import { MainButton } from "../../Components/Form/button";

interface VerificationCardProps {
  title: string;
  description?: string;
  email?: string;
  buttonText: string;
  onButtonClick: () => void;
  showResend?: boolean;
  onResend?: () => void;
}

const VerificationCard: React.FC<VerificationCardProps> = ({
  title,
  description,
  email,
  buttonText,
  onButtonClick,
  showResend = false,
  onResend,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-96">
      <div className="bg-[#E0EFDE80] border border-[#0000001A] rounded-[10px] p-10 text-center max-w-sm w-full">
        <div className="flex justify-center mb-4">
        <img src={Logo} alt="Logo" className="w-12" />
        </div>
        <h2 className="text-[32px] text-black font-semibold mb-2">{title}</h2>
        <p className="text-[#0000004D] text-[16px] font-medium mb-4">
  {email ? (
    <>
      Click the link sent to <br/><span className="text-black">{email}</span> to continue
    </>
  ) : (
    description
  )}
</p>

        <div className="mt-8">
        <MainButton 
          onClick={onButtonClick} 
          className="w-full bg-black py-2">
          {buttonText}
        </MainButton>
        </div>
        {showResend && onResend && (
          <p className="text-[16px] text-[#00000080] mt-4">
            Didn’t receive link? 
            <button 
              onClick={onResend} 
              className="text-black text-[16px] font-medium hover:underline ml-1">
              Resend email
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default VerificationCard;
