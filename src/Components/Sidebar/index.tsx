import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useOnboarding } from '../../Pages/Onboarding/context/onboardingContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { state } = useOnboarding();
  
  const isActive = (path: string) => location.pathname.includes(path);
  
  return (
    <div className="flex flex-col px-4 py-2 w-full text-white">
      <Link
        to="/onboarding/company-details"
        className={`flex items-start space-x-4 mb-10 p-2 rounded 
        }`}
      >
        <div className="bg-blue-100 p-2 rounded">
          <svg className="h-6 w-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div>
          <h2 className="font-medium">Company detail</h2>
          <p className="text-sm opacity-80">Provide company detail</p>
        </div>
      </Link>
      
      <Link
        to="/onboarding/invite-team"
        className={`flex items-start space-x-4 mb-10 p-2 rounded
        }`}
      >
        <div className="bg-blue-100 p-2 rounded b">
          <svg className="h-6 w-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <div>
          <h2 className="font-medium">Invite your team</h2>
          <p className="text-sm opacity-80">Start collaborating with your team</p>
        </div>
      </Link>
      
      {state.companyName && state.teamMembers.length > 0 && (
        <Link
          to="/onboarding/completion"
          className={`flex items-start space-x-4 mb-10 p-2 rounded ${
            isActive('completion') ? 'bg-blue-700' : ''
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
      )}
    </div>
  );
};

export default Sidebar;