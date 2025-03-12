import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from './context/OnboardingContext';
import ProgressBar from '../../Components/progressBar';
import FormSelect from '../../Components/select';
import { FormInput } from '../../Components/input';

const roleOptions = [
  { value: 'Consultant', label: 'Consultant' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Admin', label: 'Admin' }
];

const InviteTeamPage: React.FC = () => {
  const { state, dispatch } = useOnboarding();
  const navigate = useNavigate();

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    dispatch({ 
      type: 'UPDATE_TEAM_MEMBER', 
      payload: { 
        index, 
        data: { [field]: value } as Partial<{ email: string; role: string }> 
      } 
    });
  };

  const handleAddTeamMember = () => {
    dispatch({ 
      type: 'ADD_TEAM_MEMBER', 
      payload: { email: '', role: 'Consultant' } 
    });
  };

  const handleBack = () => {
    navigate('/onboarding/company-details');
  };

  const handleComplete = () => {
    // Save data or send to API
    console.log('Onboarding data:', state);
    navigate('/onboarding/completion');
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-8">
      <h1 className="text-2xl font-semibold mb-8">Invite your team</h1>
      <ProgressBar currentStep={2} totalSteps={3} />
      
      {state.teamMembers.map((member, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <FormInput
            label={index === 0 ? "Email" : undefined}
            type="email"
            placeholder="Email"
            value={member.email}
            onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
          />
          
          <FormSelect
            label={index === 0 ? "Role" : undefined}
            options={roleOptions}
            value={member.role}
            onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
          />
        </div>
      ))}
      
      <button 
        className="flex items-center text-gray-600 mt-4 hover:text-gray-800 transition-colors"
        onClick={handleAddTeamMember}
      >
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add another user
      </button>
      
      <div className="flex justify-between mt-8">
        <button 
          className="bg-white text-gray-700 px-6 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          onClick={handleBack}
        >
          Back
        </button>
        <button 
          className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          onClick={handleComplete}
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default InviteTeamPage;