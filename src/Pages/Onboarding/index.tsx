import { useSelector, 
    // useDispatch
 } from "react-redux";
import { RootState } from "../../Redux/store";
// import { nextStep, prevStep } from "../../Redux/store/slices/onboardingSlice";  
import Step1 from "./Step1";
import Step2 from "./Step2";
import Sidebar from "../../Components/Sidebar";
import ProgressBar from "../../Components/progressBar";
// import { MainButton } from "../../Components/Form/button";

const Onboarding = () => {
  const activeStep = useSelector((state: RootState) => state.onboarding.activeStep);
//   const dispatch = useDispatch();

  const totalSteps = 2;

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="flex px-8 bg-white overflow-x-hidden w-screen h-screen relative">
      <nav className=" z-20 md:flex-[.24] lg:flex-[.24] h-[92vh] mt-8 rounded-lg fixed top-0 md:w-[24%] hidden md:block">
        <div
          className="flex flex-col rounded-lg h-full items-center w-full "
          style={{
            background: "#E0EFDE",
          }}
        >

        <Sidebar />

      </div>
      </nav>

      {/* Main Onboarding Content */}
      <div className=" max-w-6xl w-full justify-center flex-col flex mx-auto sm:w-[97vw] lg:w-[98vw] md:my-[70px] md:pl-48 md:w-[96vw] lg:pl-[26vw] mb-[70px]">
          
        {/* Progress Bar */}
        {/* <div className="z-10 bg-white sticky top-0"> */}
        <ProgressBar currentStep={activeStep} totalSteps={totalSteps} />
        {/* </div> */}

        {/* Step Content */}
        {renderStep()}

        {/* Navigation Buttons
        <div className="flex space-x-4 mt-6">
          {activeStep > 1 && (
            <div
            //  className="flex justify-end mt-6"
            onClick={() => dispatch(prevStep())}
            >
            <MainButton type="button" variant="outlined">Back</MainButton>
          </div>
          )}
          {activeStep < totalSteps && (
            <div 
            // className="flex justify-end mt-6"
            onClick={() => dispatch(nextStep())}
            >
            <MainButton type="submit">Save and continue</MainButton>
          </div>
          )}
        </div> */}

      </div>

    </div>
  );
};

export default Onboarding;
