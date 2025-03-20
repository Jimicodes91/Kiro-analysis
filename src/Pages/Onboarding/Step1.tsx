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
import { useEffect } from "react";

const Step1 = () => {
  const dispatch = useDispatch();
  const storedCompanyDetails = useSelector((state: RootState) => state.onboarding.companyDetails);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(companyDetailsSchema),
    mode: "onChange",
    defaultValues: storedCompanyDetails,
  });

  // Ensure Redux state is loaded into form
  useEffect(() => {
    reset(storedCompanyDetails);
  }, [storedCompanyDetails, reset]);


  const onSubmit = (data: CompanyDetails) => {
    dispatch(setCompanyDetails(data));
    dispatch(nextStep());
  };

  return (
    <div>
         {/* <div className=" bg-white z-10 sticky top-10"> */}
      <h1 className="text-[24px] font-bold mb-12">Company detail</h1>
      {/* </div> */}
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
          <FormInput
            label="Industry type"
            placeholder="Industry type"
            {...register("industry")}
            error={errors.industry?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Company size"
            options={[
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ]}
            {...register("size")}
            error={errors.size?.message}
          />
          <FormSelect
            label="Country"
            options={[
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
            options={[
              { value: "nyc", label: "New York" },
              { value: "london", label: "London" },
              { value: "toronto", label: "Toronto" },
            ]}
            {...register("city")}
            error={errors.city?.message}
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
          <MainButton type="submit">Save and continue</MainButton>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Step1;
