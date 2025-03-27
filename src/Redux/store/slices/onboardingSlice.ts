import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingState, CompanyDetails, TeamMember } from '../../../types';


const initialState: OnboardingState = {
  activeStep: 1,
  companyDetails: { name: "", industryType: "", size: "", country: "", address: "", city: "", postalCode: "" },
  teamMembers: [{ email: "", role: "" }],
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.activeStep < 3) state.activeStep += 1;
    },
    prevStep: (state) => {
      if (state.activeStep > 1) state.activeStep -= 1;
    },
    goToStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    setCompanyDetails: (state, action: PayloadAction<CompanyDetails>) => {
      state.companyDetails = action.payload;
    },
    setTeamMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.teamMembers = action.payload;
    },
  },
});

export const { nextStep, prevStep, goToStep, setCompanyDetails, setTeamMembers } = onboardingSlice.actions;
export default onboardingSlice.reducer;
