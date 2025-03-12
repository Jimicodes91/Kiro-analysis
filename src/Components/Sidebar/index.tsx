import React from 'react'
import { Link, 
  // useLocation
 } from 'react-router-dom';
import { Active_Buildings, Inactive_Users } from '../../assets/icons';
// import { useOnboarding } from '../../Pages/Onboarding/context/OnboardingContext';

const Sidebar: React.FC = () => {
  // const location = useLocation();
  // const { state } = useOnboarding();
  
  // const isActive = (path: string) => location.pathname.includes(path);
  
  return (
    <div className="flex flex-col px-4 py-2 w-full text-white">
      <Link
        to="/onboarding/company-details"
        className={`flex items-start space-x-4 mb-10 p-2 rounded 
        }`}
      >
        <div className="bg-[#0000000D] p-2 rounded border border-[#0924281A]">
         <img src={Active_Buildings} alt='Active_Buildings'/>
        </div>
        <div>
          <h2 className="font-medium text-[#000]">Company detail</h2>
          <p className="text-sm text-[#00000080]">Provide company detail</p>
        </div>
      </Link>
      
      <Link
        to="/onboarding/invite-team"
        className={`flex items-start space-x-4 mb-10 p-2 rounded
        }`}
      >
       <div className="bg-[#0000000D] p-2 rounded border border-[#0924281A]">
         <img src={Inactive_Users} alt='Inactive_Users'/>
        </div>
        <div>
          <h2 className="font-medium text-[#00000080]">Invite your team</h2>
          <p className="text-sm text-[#00000040]">Start collaborating with your team</p>
        </div>
      </Link>
      
      {/* {state.companyName && state.teamMembers.length > 0 && (
        <Link
          to="/onboarding/completion"
          className={`flex items-start space-x-4 mb-10 p-2 rounded
          }`}
        >
          <div className="bg-blue-100 p-2 rounded">
            <svg className="h-6 w-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h2 className="font-medium">Completion</h2>
            <p className="text-sm opacity-80">Account setup complete</p>
          </div>
        </Link>
      )} */}
    </div>
  );
};

export default Sidebar;