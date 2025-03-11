import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from './context/onboardingContext';
import ProgressBar from '../../Components/progressBar';
import FormSelect from '../../Components/select';
import { FormInput } from '../../Components/input';

const industryOptions = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Retail', label: 'Retail' }
];

const companySizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201+', label: '201+ employees' }
];

const countryOptions = [
  { value: 'UAE', label: 'UAE' },
  { value: 'USA', label: 'USA' },
  { value: 'UK', label: 'UK' },
  { value: 'Canada', label: 'Canada' }
];

const cityOptions = [
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Abu Dhabi', label: 'Abu Dhabi' },
  { value: 'Sharjah', label: 'Sharjah' }
];

const CompanyDetailsPage: React.FC = () => {
  const { state, dispatch } = useOnboarding();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_COMPANY_DETAILS', payload: { [field]: value } });
  };

  const handleNext = () => {
    navigate('/onboarding/invite-team');
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-8">
      <h1 className="text-2xl font-semibold mb-8">Company detail</h1>
      <ProgressBar currentStep={1} totalSteps={3} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Company Name"
          options={[{ value: 'Orizon digital', label: 'Orizon digital' }]}
          value={state.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
        />
        
        <FormSelect
          label="Industry type"
          options={industryOptions}
          value={state.industryType}
          onChange={(e) => handleInputChange('industryType', e.target.value)}
          placeholder="Select industry type"
        />
        
        <FormSelect
          label="Company size"
          options={companySizeOptions}
          value={state.companySize}
          onChange={(e) => handleInputChange('companySize', e.target.value)}
          placeholder="Select company size"
        />
        
        <FormSelect
          label="Country"
          options={countryOptions}
          value={state.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
        />
      </div>
      
      <div className="mt-6">
        <FormInput
          label="Company Address"
          type="text"
          value={state.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter company address"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FormSelect
          label="City"
          options={cityOptions}
          value={state.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          placeholder="Select city"
        />
        
        <FormInput
          label="Postal code"
          type="text"
          value={state.postalCode}
          onChange={(e) => handleInputChange('postalCode', e.target.value)}
        />
      </div>
      
      <div className="flex justify-end mt-8">
        <button 
          className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          onClick={handleNext}
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;