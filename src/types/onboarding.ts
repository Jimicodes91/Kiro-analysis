export interface CompanyDetails {
  name: string;
  industryType: string;
  size: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface TeamMember {
  email: string;
  role: string;
}

export interface AccountDetails {
  name: string;
  password: string;
}

export interface OnboardingState {
  activeStep: number;
  companyDetails: CompanyDetails;
  teamMembers: TeamMember[];
}

export interface SidebarLinks {
  id: number;
  title: string;
  url: string;
  image: React.ReactElement | string;
  headingText: string;
}
