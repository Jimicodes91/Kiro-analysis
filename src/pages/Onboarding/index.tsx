import ProgressBar from "@/components/ui/progress-bar";
import Sidebar from "../../components/Sidebar";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { useOnboarding } from "./onboarding-context";

const Onboarding = () => {
  const { stage } = useOnboarding();

  const totalSteps = 2;

  const renderStep = () => {
    switch (stage) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="flex px-8 py-10 gap-x-8 bg-white overflow-x-hidden w-screen h-screen relative">
      <nav className="z-20 flex-shrink-0 hidden md:block">
        <div
          className="flex flex-col rounded-[10px] h-full items-center w-full "
          style={{
            background: "#E0EFDE",
          }}
        >
          <Sidebar />
        </div>
      </nav>

      {/* Main Onboarding Content */}
      <div className="w-full py-2 md:py-10 flex-1 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Progress Bar */}
          {/* <div className="z-10 bg-white sticky top-0"> */}
          <ProgressBar currentStep={stage} totalSteps={totalSteps} />
          {/* </div> */}

          {/* Step Content */}
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
