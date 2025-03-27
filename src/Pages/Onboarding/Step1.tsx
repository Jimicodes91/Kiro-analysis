import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { nextStep, setCompanyDetails } from "../../Redux/store/slices/onboardingSlice";
import { RootState } from "../../Redux/store";
import { companyDetailsSchema } from "../../Components/validationSchema/onboarding";
import { FormInput } from "../../Components/Form/input";
import { FormSelect } from "../../Components/Form/select";
import { MainButton } from "../../Components/Form/button";
import { CompanyDetails } from "../../types";
import { useEffect, useState } from "react";
import { createCompanyApi } from "../../Services";
import Toast from "../../Components/Toast";

// Define a type for the state options
type StateOption = { value: string; label: string };

// Define a type for the country-states mapping
type CountryStatesMap = {
  [key in 'Nigeria' | 'usa' | 'uk' | 'ca']: StateOption[];
};

// Predefined country-state mappings
const COUNTRY_STATES: CountryStatesMap = {
  Nigeria: [
    { value: 'lagos', label: 'Lagos' },
    { value: 'abuja', label: 'Abuja' },
    { value: 'ibadan', label: 'Ibadan' },
    { value: 'kano', label: 'Kano' }
  ],
  usa: [
    { value: 'ny', label: 'New York' },
    { value: 'ca', label: 'California' },
    { value: 'tx', label: 'Texas' },
    { value: 'fl', label: 'Florida' }
  ],
  uk: [
    { value: 'london', label: 'London' },
    { value: 'manchester', label: 'Manchester' },
    { value: 'birmingham', label: 'Birmingham' },
    { value: 'liverpool', label: 'Liverpool' }
  ],
  ca: [
    { value: 'ontario', label: 'Ontario' },
    { value: 'quebec', label: 'Quebec' },
    { value: 'bc', label: 'British Columbia' },
    { value: 'alberta', label: 'Alberta' }
  ]
};

const Step1 = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const storedCompanyDetails = useSelector((state: RootState) => state.onboarding.companyDetails);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(companyDetailsSchema),
    mode: "onChange",
    defaultValues: storedCompanyDetails,
  });

 // Watch country to dynamically update states
 const watchCountry = watch("country");

 useEffect(() => {
   // Type-safe way to check and set states
   if (watchCountry && 
       Object.keys(COUNTRY_STATES).includes(watchCountry)) {
     setStates(COUNTRY_STATES[watchCountry as keyof CountryStatesMap]);
   } else {
     setStates([]);
   }
 }, [watchCountry]);

  // Ensure Redux state is loaded into form
  useEffect(() => {
    reset(storedCompanyDetails);
  }, [storedCompanyDetails, reset]);

  const onSubmit = async (data: CompanyDetails) => {
    setLoading(true);
    try {
      const response = await createCompanyApi(data);
      dispatch(setCompanyDetails(data));
      dispatch(nextStep());
      Toast.success(response.message || "Company created successfully")
    } catch (error) {
      console.error("Error creating company:", error);
      const errorMessage = (error as { data?: string })?.data || "Company creation failed";
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-[24px] font-bold mb-12">Company detail</h1>
      <div className="overflow-y-auto flex-1">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-12 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Company name"
            placeholder="Company name"
            {...register("name")}
            error={errors.name?.message}
          />
          <FormSelect
            label="Industry type"
            options={[
              { value: "technology", label: "Technology" },
              { value: "finance", label: "Finance" },
              { value: "healthcare", label: "Healthcare" },
              { value: "education", label: "Education" },
              { value: "retail", label: "Retail" },
              { value: "manufacturing", label: "Manufacturing" },
              { value: "consulting", label: "Consulting" },
              { value: "entertainment", label: "Entertainment" },
            ]}
            {...register("industryType")}
            error={errors.industryType?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Company size"
            options={[
              { value: "1-10", label: "1-10 Employees" },
              { value: "11-50", label: "11-50 Employees" },
              { value: "51-100", label: "51-100 Employees" },
              { value: "101-250", label: "101-250 Employees" },
              { value: "251-500", label: "251-500 Employees" },
              { value: "500+", label: "500+ Employees" },
            ]}
            {...register("size")}
            error={errors.size?.message}
          />
          <FormSelect
            label="Country"
            options={[
              { value: "Nigeria", label: "Nigeria" },
              { value: "usa", label: "United States" },
              { value: "uk", label: "United Kingdom" },
              { value: "ca", label: "Canada" },
            ]}
            {...register("country")}
            error={errors.country?.message}
          />
        </div>
        <FormInput
          label="Company Address"
          placeholder="Company Address"
          {...register("address")}
          error={errors.address?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="City"
            options={states}
            {...register("city")}
            error={errors.city?.message}
            // disabled={states.length === 0}
            placeholder={states.length === 0 ? "Select Country First" : "Select City"}
          />
          <FormInput
            label="Postal Code"
            placeholder="Postal Code"
            {...register("postalCode")}
            error={errors.postalCode?.message}
          />
        </div>
        </div>
        <div className="flex justify-end">
          <MainButton type="submit" isLoading={loading}>Save and continue</MainButton>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Step1;