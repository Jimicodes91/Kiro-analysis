import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from './context/OnboardingContext';
import ProgressBar from '../../Components/progressBar';


const CompletionPage: React.FC = () => {
  const { state } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user completed previous steps
    if (!state.companyName || state.teamMembers.length === 0) {
      navigate('/onboarding/company-details');
    }
  }, [state, navigate]);

  const handleFinish = () => {
    // Navigate to dashboard or home
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-8">
      <h1 className="text-2xl font-semibold mb-8">Setup Complete</h1>
      <ProgressBar currentStep={3} totalSteps={3} />
      
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Your account is ready!</h2>
        <p className="text-gray-600 mb-8">
          Your company profile has been set up successfully and team invitations have been sent.
        </p>
        
        <div className="flex justify-center">
          <button 
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            onClick={handleFinish}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;