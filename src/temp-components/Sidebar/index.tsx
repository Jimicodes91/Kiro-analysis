import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
// import { goToStep } from "../../Redux/store/slices/onboardingSlice";
import { OnBoardingGroup } from "../../assets";
import {
  Active_Buildings,
  Active_Users,
  Inactive_Buildings,
  Inactive_Users,
} from "../../assets/icons";

const steps = [
  {
    id: 1,
    title: "Company detail",
    description: "Provide company details",
    activeImage: Active_Buildings,
    inactiveImage: Inactive_Buildings,
  },
  {
    id: 2,
    title: "Invite your team",
    description: "Start collaborating with your team",
    activeImage: Active_Users,
    inactiveImage: Inactive_Users,
  },
];

const Sidebar: React.FC = () => {
  // const dispatch = useDispatch();
  const activeStep = useSelector((state: RootState) => state.onboarding.activeStep);

  return (
    <div className="h-screen py-8 px-4">
      <ul>
        {steps.map((step, index) => {
          const isActive = activeStep === step.id;
          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-start space-x-4 mb-1 p-2`}
                // onClick={() => dispatch(goToStep(step.id))}
              >
                {/* Icon */}
                <div
                  className={`p-2 rounded border ${
                    isActive
                      ? "border-[#0924281A] bg-[#0924281A]"
                      : "border-gray-300 bg-[#0000000D]"
                  }`}
                >
                  <img
                    src={isActive ? step.activeImage : step.inactiveImage}
                    alt={step.title}
                  />
                </div>

                {/* Step Info */}
                <div>
                  <h2
                    className={`font-bold text-[18px] ${
                      isActive ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h2>
                  <p
                    className={`text-[14px] font-medium ${
                      isActive ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
                {/* Image at Bottom Right */}
                <div className="absolute bottom-0 right-0">
                  <img
                    src={OnBoardingGroup}
                    alt="Group Illustration"
                    className="w-full max-w-[407px]"
                  />
                </div>
              </div>

              {/* Vertical Line (not rendered after the last step) */}
              {!isLastStep && (
                <div className="ml-7 h-10 w-[2px] bg-[#0924281A] mb-1"></div>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
