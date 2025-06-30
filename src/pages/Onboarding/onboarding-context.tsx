import { PAGES } from "@/lib/constants";
import { getUserSession } from "@/services/api.service";
import { companyDetailsSchema } from "@/utils/validation-schema/onboarding";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InferType } from "yup";

type CompanyDetails = InferType<typeof companyDetailsSchema>;
interface OnboardingContextInterface {
  onNext: () => void;
  onPrev: () => void;
  stage: number;
  companyData: CompanyDetails;
  updateCompanyDetails: (data: CompanyDetails) => void;
}

interface OnboardingPropsInterface {
  children?: React.ReactNode;
}

const OnboardingCtx = React.createContext<OnboardingContextInterface>(
  {} as OnboardingContextInterface
);

const OnboardingContextProvider = ({ children }: OnboardingPropsInterface) => {
  const user = getUserSession();
  const navigate = useNavigate();
  const [stage, setStage] = React.useState(1);
  const [companyData, setCompanyData] = React.useState<CompanyDetails>({
    address: "",
    city: "",
    country: "",
    industry_type: "",
    name: "",
    postal_code: "",
    size: "",
  });

  const onNext = () => {
    if (stage >= 2) return;
    setStage((prev) => prev + 1);
  };

  const onPrev = () => {
    if (stage === 1) return;
    setStage((prev) => prev - 1);
  };

  const updateCompanyDetails = (data: CompanyDetails) => {
    setCompanyData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  useEffect(() => {
    if (user?.company_id && !companyData.address) {
      navigate(PAGES.PROJECT_PAGE, {
        replace: true,
      });
    }
  }, [navigate, user, companyData]);

  return (
    <OnboardingCtx.Provider
      value={{
        stage,
        onNext,
        onPrev,
        companyData,
        updateCompanyDetails,
      }}
    >
      {children}
    </OnboardingCtx.Provider>
  );
};

export const useOnboarding = () => {
  const context = React.useContext(OnboardingCtx);

  if (context === null) {
    throw new Error("useOnboarding must be used within a Onboarding Provider");
  }
  return context;
};

export default OnboardingContextProvider;
