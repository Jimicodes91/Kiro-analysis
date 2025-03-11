import { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types
export interface TeamMember {
  email: string;
  role: string;
}

export interface OnboardingState {
  companyName: string;
  industryType: string;
  companySize: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  teamMembers: TeamMember[];
  currentStep: number;
}

type OnboardingAction = 
  | { type: 'UPDATE_COMPANY_DETAILS'; payload: Partial<OnboardingState> }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: { index: number; data: Partial<TeamMember> } }
  | { type: 'REMOVE_TEAM_MEMBER'; payload: number }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };

interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
}

const initialState: OnboardingState = {
  companyName: 'Orizon digital',
  industryType: '',
  companySize: '',
  country: 'UAE',
  address: '',
  city: '',
  postalCode: '',
  teamMembers: [{ email: 'Jessicaparker@gmail.com', role: 'Consultant' }],
  currentStep: 1
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const onboardingReducer = (state: OnboardingState, action: OnboardingAction): OnboardingState => {
  switch (action.type) {
    case 'UPDATE_COMPANY_DETAILS':
      return { ...state, ...action.payload };
    case 'ADD_TEAM_MEMBER':
      return { ...state, teamMembers: [...state.teamMembers, action.payload] };
    case 'UPDATE_TEAM_MEMBER': {
      const updatedMembers = [...state.teamMembers];
      updatedMembers[action.payload.index] = { 
        ...updatedMembers[action.payload.index], 
        ...action.payload.data 
      };
      return { ...state, teamMembers: updatedMembers };
    }
    case 'REMOVE_TEAM_MEMBER':
      return { 
        ...state, 
        teamMembers: state.teamMembers.filter((_, index) => index !== action.payload) 
      };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(1, state.currentStep - 1) };
    default:
      return state;
  }
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
